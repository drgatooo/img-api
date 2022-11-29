import express from "express";
import cors from "cors";
import { generate } from "spotify-card";

const app = express();
app.use(cors());
app.listen(process.env["PORT"] || 3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", async (_, res) => {
  return res.json({ hello: "world" });
});

app.get("/spotify-card", async (req, res) => {
  const cover = req.query["cover"] as string;
  const title = req.query["title"] as string;
  const artist = req.query["artist"] as string;

  if (!cover) {
    return res.status(400).json({ error: "cover is required" });
  }

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  if (!artist) {
    return res.status(400).json({ error: "artist is required" });
  }

  const decoded = {
    cover: Buffer.from(cover, "base64").toString("utf8"),
    title: Buffer.from(title, "base64").toString("utf8"),
    artist: Buffer.from(artist, "base64").toString("utf8"),
  };

  const card = await generate({
    blur: {
      image: false,
      progress: false,
      text: false,
    },
    adaptiveTextcolor: true,
    songData: {
      cover: decoded.cover,
      title: decoded.title,
      album: decoded.artist,
    },
    platform: "custom",
    progressBar: false,
    width: 950,
    height: 300,
    margins: {
      album: 5,
      title: 5,
      cover: 20,
    },
    defaultMargin: 20,
    fontSizes: {
      album: 30,
    },
  });

  // send the card as image
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": card.length,
  });
  return res.end(card);
});
