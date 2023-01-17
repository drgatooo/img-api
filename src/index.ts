import express from "express";
import cors from "cors";
import { SpotifyCard } from "./generators/spotify";
import { registerFont } from "canvas";

registerFont("./assets/GothamBold.ttf", { family: "GothamBold" });
registerFont("./assets/Gotham-Black.otf", { family: "GothamBlack" });
registerFont("./assets/GothamBook.ttf", { family: "GothamBook" });
registerFont("./assets/GothamMedium.ttf", { family: "GothamMedium" });
registerFont("./assets/seguiemj.ttf", { family: "segoe-ui-emoji" });
registerFont("./assets/arial-unicode-ms.ttf", {
  family: "Arial Unicode MS",
});

const app = express();
app.use(cors());
app.listen(process.env["PORT"] || 3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", async (_, res) => {
  return res.json({ hello: "world", date: new Date() });
});

app.get("/v1/music-card", async (req, res) => {
  const cover = req.query["cover"] as string;
  const title = req.query["title"] as string;
  const artist = req.query["artist"] as string;
  const orientation = req.query["orientation"] as
    | "square"
    | "portrait"
    | "landscape"
    | undefined;
  const listenOn = (req.query["listen-on"] || "bWVvbmcgYm90") as string;

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
    listenOn: Buffer.from(listenOn, "base64").toString("utf8"),
    orientation: orientation || "landscape",
  };

  try {
    const card = await SpotifyCard(
      {
        artist: decoded.artist,
        cover: decoded.cover,
        name: decoded.title,
        text: "canción",
        listenOn: "meong bot",
      },
      undefined,
      decoded.orientation,
      undefined
    );

    // send the card as image
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": card.length,
    });
    return res.end(card);
  } catch (error) {
    return res
      .status(500)
      .json({ error: (error as Error).message ?? `${error}` });
  }
});

app.get("/v1/playlist-card", async (req, res) => {
  const cover = req.query["cover"] as string;
  const title = req.query["title"] as string;
  const owner = req.query["owner"] as string;
  const orientation = req.query["orientation"] as
    | "square"
    | "portrait"
    | "landscape"
    | undefined;
  const listenOn = (req.query["listen-on"] || "bWVvbmcgYm90") as string;

  if (!cover) {
    return res.status(400).json({ error: "cover is required" });
  }

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  if (!owner) {
    return res.status(400).json({ error: "owner is required" });
  }

  const decoded = {
    cover: Buffer.from(cover, "base64").toString("utf8"),
    title: Buffer.from(title, "base64").toString("utf8"),
    owner: Buffer.from(owner, "base64").toString("utf8"),
    listenOn: Buffer.from(listenOn, "base64").toString("utf8"),
    orientation: orientation || "square",
  };

  try {
    const card = await SpotifyCard(
      {
        artist: decoded.owner,
        cover: decoded.cover,
        name: decoded.title,
        text: "playlist",
        listenOn: "meong bot",
      },
      undefined,
      decoded.orientation,
      undefined
    );

    // send the card as image
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": card.length,
    });
    return res.end(card);
  } catch (error) {
    return res
      .status(500)
      .json({ error: (error as Error).message ?? `${error}` });
  }
});
