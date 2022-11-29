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
const spotify_1 = require("./generators/spotify");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.listen(process.env["PORT"] || 3000, () => {
    console.log("Server is running on port 3000");
});
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ hello: "world" });
}));
app.get("/music-card", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        cover: Buffer.from(cover, "base64").toString("utf8"),
        title: Buffer.from(title, "base64").toString("utf8"),
        artist: Buffer.from(artist, "base64").toString("utf8"),
    };
    const card = yield (0, spotify_1.SpotifyCard)({
        artist: decoded.artist,
        imageURL: decoded.cover,
        name: decoded.title,
    });
    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": card.length,
    });
    return res.end(card);
}));
