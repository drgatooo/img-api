"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const spotify_card_1 = require("spotify-card");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.listen(process.env["PORT"] || 3000, () => {
    console.log("Server is running on port 3000");
});
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ hello: "world" });
}));
app.get("/spotify-card", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cover = req.query["cover"];
    const title = req.query["title"];
    const artist = req.query["artist"];
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
        cover: atob(cover),
        title: atob(title),
        artist: atob(artist),
    };
    const card = yield (0, spotify_card_1.generate)({
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
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": card.length,
    });
    return res.end(card);
}));
