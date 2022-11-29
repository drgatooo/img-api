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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLight = exports.SpotifyCard = void 0;
const canvas_1 = require("canvas");
const color_thief_node_1 = require("color-thief-node");
let rgb2hex = (c) => {
    var _a;
    return "#" +
        ((_a = c
            .match(/\d+/g)) === null || _a === void 0 ? void 0 : _a.map((x) => (+x).toString(16).padStart(2, "0")).join(""));
};
function textWrap(text, max, min, maxWidth, ctx, x, y, fontPre, fontPost) {
    let currentFontSize, firstLine = "", secondLine = "";
    for (currentFontSize = parseInt(max); currentFontSize >= parseInt(min); currentFontSize--) {
        ctx.font = fontPre + currentFontSize + fontPost;
        let currentWidth = ctx.measureText(text).width;
        if (currentWidth < maxWidth) {
            break;
        }
    }
    if (currentFontSize >= parseInt(min)) {
        ctx.fillText(text, x, y);
        return 0;
    }
    else {
        for (currentFontSize = parseInt(max); currentFontSize >= parseInt(min); currentFontSize--) {
            let tobreak = false;
            ctx.font = fontPre + currentFontSize + fontPost;
            let words = text.split(" ");
            firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    words = words.splice(_);
                    const secondLine = words.join(" ");
                    if (ctx.measureText(secondLine).width < maxWidth) {
                        tobreak = true;
                    }
                    break;
                }
            }
            if (tobreak) {
                break;
            }
        }
        if (currentFontSize >= parseInt(min)) {
            ctx.font = fontPre + currentFontSize + fontPost;
            let words = text.split(" ");
            firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    ctx.fillText(firstLine, x, y);
                    secondLine = words.slice(_).join(" ");
                    ctx.fillText(secondLine, x, y + currentFontSize);
                    return currentFontSize;
                }
            }
        }
        else {
            let words = text.split(" ");
            firstLine = words[0];
            ctx.font = fontPre + min + fontPost;
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    words = words.splice(_);
                    secondLine = words[0];
                    for (let __ = 1; __ < words.length; __++) {
                        let word = words[__];
                        let currentLineWidth = ctx.measureText(secondLine + " " + word).width;
                        if (currentLineWidth < maxWidth) {
                            secondLine += " " + word;
                        }
                        else {
                            text = firstLine + " " + secondLine + "...";
                            break;
                        }
                    }
                    break;
                }
            }
            for (currentFontSize = parseInt(max); currentFontSize >= parseInt(min); currentFontSize--) {
                let tobreak = false;
                ctx.font = fontPre + currentFontSize + fontPost;
                let words = text.split(" ");
                firstLine = words[0];
                for (let _ = 1; _ < words.length; _++) {
                    let word = words[_];
                    let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                    if (currentLineWidth < maxWidth) {
                        firstLine += " " + word;
                    }
                    else {
                        words = words.splice(_);
                        secondLine = words.join(" ");
                        if (ctx.measureText(secondLine).width < maxWidth) {
                            tobreak = true;
                        }
                        break;
                    }
                }
                if (tobreak) {
                    break;
                }
            }
            ctx.font = fontPre + currentFontSize + fontPost;
            words = text.split(" ");
            firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    ctx.fillText(firstLine, x, y);
                    secondLine = words.slice(_).join(" ");
                    ctx.fillText(secondLine, x, y + currentFontSize);
                    return currentFontSize;
                }
            }
        }
    }
    return 0;
}
function SpotifyCard(data, listenOn) {
    return __awaiter(this, void 0, void 0, function* () {
        const width = 1200;
        const height = 630;
        const imageX = 105;
        const imageY = 115;
        const imageWidth = 400;
        const imageHeight = 400;
        const songX = 560;
        const songY = 200;
        const songNameX = 560;
        const songNameY = 270;
        const songFontMax = "100";
        const songFontMin = "70";
        const songArtistX = 560;
        let songArtistY = 380;
        const songArtistFontMax = "40";
        const songArtistFontMin = "30";
        const bottomTextX = 805;
        let bottomTextY = 542;
        const bottomTextFont = "20px";
        const text = "CANCIÓN";
        const canvas = (0, canvas_1.createCanvas)(width, height);
        const context = canvas.getContext("2d");
        const image = yield (0, canvas_1.loadImage)(data.imageURL);
        const palette = yield (0, color_thief_node_1.getColorFromURL)(data.imageURL);
        const avcolor = rgb2hex(`rgb(${palette.join(",")})`);
        const isBgLight = (0, exports.isLight)(avcolor);
        context.fillStyle = avcolor;
        context.fillRect(0, 0, width, height);
        context.textBaseline = "top";
        let fontColor = isBgLight ? "#333333" : "#ffffff";
        context.fillStyle = fontColor;
        context.font = "bold 22px GothamBold";
        let ctext = text.split("").join(String.fromCharCode(8202));
        context.fillText(ctext, songX, songY);
        songArtistY +=
            textWrap(data.name, songFontMax, songFontMin, 580, context, songNameX, songNameY, "bold ", "px GothamBold") - 5;
        let downShift = textWrap(data.artist, songArtistFontMax, songArtistFontMin, 500, context, songArtistX, songArtistY, "bold ", "px GothamBook");
        bottomTextY += downShift;
        context.font = `${bottomTextFont} GothamBold`;
        var cbottomText = `ESCUCHA EN ${(listenOn || "MEONG BOT").toUpperCase()}`
            .split("")
            .join(String.fromCharCode(8202));
        context.fillText(cbottomText, bottomTextX, bottomTextY);
        context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
        const buffer = canvas.toBuffer("image/png");
        const cardURL = buffer.toString("base64");
        const img = Buffer.from(cardURL, "base64");
        return img;
    });
}
exports.SpotifyCard = SpotifyCard;
const isLight = (color) => {
    let r, g, b, color_match, hsp;
    if (color.match(/^rgb/)) {
        color_match = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        r = color_match[1];
        g = color_match[2];
        b = color_match[3];
    }
    else {
        color_match = +(("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&")));
        r = color_match >> 16;
        g = (color_match >> 8) & 255;
        b = color_match & 255;
    }
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    return hsp > 127.5;
};
exports.isLight = isLight;
