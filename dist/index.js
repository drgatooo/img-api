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
const canvas_1 = require("canvas");
(0, canvas_1.registerFont)("./assets/GothamBold.ttf", { family: "GothamBold" });
(0, canvas_1.registerFont)("./assets/Gotham-Black.otf", { family: "GothamBlack" });
(0, canvas_1.registerFont)("./assets/GothamBook.ttf", { family: "GothamBook" });
(0, canvas_1.registerFont)("./assets/GothamMedium.ttf", { family: "GothamMedium" });
(0, canvas_1.registerFont)("./assets/seguiemj.ttf", { family: "segoe-ui-emoji" });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.listen(process.env["PORT"] || 3000, () => {
    console.log("Server is running on port 3000");
});
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json({ hello: "world", date: new Date() });
}));
app.get("/v1/music-card", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cover = req.query["cover"];
    const title = req.query["title"];
    const artist = req.query["artist"];
    const orientation = req.query["orientation"];
    const listenOn = (req.query["listen-on"] || "bWVvbmcgYm90");
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
        const card = yield (0, spotify_1.SpotifyCard)({
            artist: decoded.artist,
            cover: decoded.cover,
            name: decoded.title,
            text: "canción",
            listenOn: "meong bot",
        }, undefined, decoded.orientation, undefined);
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": card.length,
        });
        return res.end(card);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: (_a = error.message) !== null && _a !== void 0 ? _a : `${error}` });
    }
}));
app.get("/v1/playlist-card", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const cover = req.query["cover"];
    const title = req.query["title"];
    const owner = req.query["owner"];
    const orientation = req.query["orientation"];
    const listenOn = (req.query["listen-on"] || "bWVvbmcgYm90");
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
        const card = yield (0, spotify_1.SpotifyCard)({
            artist: decoded.owner,
            cover: decoded.cover,
            name: decoded.title,
            text: "playlist",
            listenOn: "meong bot",
        }, undefined, decoded.orientation, undefined);
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": card.length,
        });
        return res.end(card);
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: (_b = error.message) !== null && _b !== void 0 ? _b : `${error}` });
    }
}));
