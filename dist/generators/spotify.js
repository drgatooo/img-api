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
exports.SpotifyCard = void 0;
const canvas_1 = require("canvas");
let rgb2hex = (c) => "#" + c.match(/\d+/g).map((x) => (+x).toString(16).padStart(2, 0)).join ``;
function getAverageColor(img) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const tempCanvas = (0, canvas_1.createCanvas)(1080, 1080);
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.drawImage(img, 0, 0, 1, 1);
            const rgb = tempCtx.getImageData(0, 0, 1, 1).data.slice(0, 3).join(", ");
            const hex = rgb2hex(rgb);
            resolve(hex);
        });
    });
}
function SpotifyCard(data, color, orientation, colorGiven) {
    return __awaiter(this, void 0, void 0, function* () {
        let totalArtist;
        let artistList = [];
        let artistString = "";
        let songName;
        let imageURL;
        let width, height, imageX, imageY, imageWidth, imageHeight, songX, songY, songFont, songNameX, songNameY, songArtistX, songArtistY, songArtistFont, bottomTextX, bottomTextY, bottomTextFont, dmX, dmY, dmW, dmH, songFontMax, songFontMin, songArtistFontMax, songArtistFontMin;
        const text = (data.text || "canción").toUpperCase();
        const bottomText = `ESCUCHAR EN`;
        if (orientation === "landscape") {
            width = 1200;
            height = 630;
            imageX = 105;
            imageY = 115;
            imageWidth = 400;
            imageHeight = 400;
            songX = 560;
            songY = 200;
            songNameX = 560;
            songNameY = 250;
            songFont = "bold 100px";
            songFontMax = "100";
            songFontMin = "70";
            songArtistX = 560;
            songArtistY = 380;
            songArtistFont = "bold 40px";
            songArtistFontMax = "40";
            songArtistFontMin = "30";
            bottomTextX = 805;
            bottomTextY = 542;
            bottomTextFont = "20px";
            dmX = 960;
            dmY = 520;
            dmW = 199.64;
            dmH = 60;
        }
        else if (orientation === "square") {
            width = 1080;
            height = 1080;
            imageX = 0;
            imageY = 330;
            imageWidth = 750;
            imageHeight = 750;
            songNameX = 70;
            songNameY = 50;
            songFont = "50px";
            songArtistX = 70;
            songArtistY = 160;
            songArtistFont = "68px";
            bottomTextX = 815;
            bottomTextY = 850;
            bottomTextFont = "30px";
            dmX = 795;
            dmY = 920;
            dmW = 250;
            dmH = 75;
        }
        else if (orientation === "portrait") {
            width = 1080;
            height = 1920;
            imageX = 146;
            imageY = 240;
            imageWidth = 788;
            imageHeight = 788;
            songX = 115;
            songY = 1127;
            songNameX = 115;
            songNameY = 1215;
            songFont = "bold 150px";
            songFontMax = "150";
            songFontMin = "130";
            songArtistX = 115;
            songArtistY = 1390;
            songArtistFont = "bold 60px";
            songArtistFontMax = "60";
            songArtistFontMin = "40";
            bottomTextX = 475;
            bottomTextY = 1800;
            bottomTextFont = "40px";
            dmX = 770;
            dmY = 1780;
            dmW = 266.19;
            dmH = 80;
        }
        songName = data.name;
        imageURL = data.cover;
        artistList.push(data.artist);
        const canvas = (0, canvas_1.createCanvas)(width, height);
        const context = canvas.getContext("2d");
        const image = yield (0, canvas_1.loadImage)(imageURL);
        const avcolor = yield getAverageColor(image);
        if (!colorGiven) {
            color = avcolor;
        }
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);
        context.textBaseline = "top";
        const fontColor = getFontColor(color, avcolor);
        context.fillStyle = fontColor;
        if (orientation === "landscape") {
            context.font = "bold 22px GothamBlack";
            var ctext = text.split("").join(String.fromCharCode(8202));
            context.fillText(ctext, songX, songY);
        }
        else if (orientation == "portrait") {
            context.font = "bold 40px GothamBlack";
            var ctext = text.split("").join(String.fromCharCode(8202));
            context.fillText(ctext, songX, songY);
        }
        if (orientation === "landscape") {
            songArtistY += textWrap(songName, songFontMax, songFontMin, 580, context, songNameX, songNameY, "bold ", "px GothamBold");
        }
        else if (orientation === "portrait") {
            songArtistY += textWrap(songName, songFontMax, songFontMin, 850, context, songNameX, songNameY, "bold ", "px GothamBold");
        }
        else {
            context.font = `${songFont} GothamBold`;
            context.fillText(songName, songNameX, songNameY);
        }
        artistString = artistList.join(", ");
        if (orientation === "landscape") {
            let downShift = textWrap(artistString, songArtistFontMax, songArtistFontMin, 500, context, songArtistX, songArtistY, "bold ", "px GothamBook");
            bottomTextY += downShift;
            dmY += downShift;
        }
        else if (orientation === "portrait") {
            textWrap(artistString, songArtistFontMax, songArtistFontMin, 500, context, songArtistX, songArtistY, "bold ", "px GothamBook");
        }
        else {
            context.font = `${songArtistFont} GothamBook`;
            context.fillText(artistString, songArtistX, songArtistY);
        }
        context.font = `${bottomTextFont} GothamBold`;
        var cbottomText = bottomText.split("").join(String.fromCharCode(8202));
        context.fillText(cbottomText, bottomTextX, bottomTextY);
        context.fillText((data.listenOn || "meong bot").toUpperCase(), dmX, dmY);
        return canvas.toBuffer();
    });
}
exports.SpotifyCard = SpotifyCard;
function textWrap(text, max, min, maxWidth, ctx, x, y, fontPre, fontPost) {
    let currentFontSize;
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
            let firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    words = words.splice(_);
                    let secondLine = words.join(" ");
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
            let firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    ctx.fillText(firstLine, x, y);
                    let secondLine = words.slice(_).join(" ");
                    ctx.fillText(secondLine, x, y + currentFontSize);
                    return currentFontSize;
                }
            }
        }
        else {
            let words = text.split(" ");
            let firstLine = words[0];
            ctx.font = fontPre + min + fontPost;
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                }
                else {
                    words = words.splice(_);
                    let secondLine = words[0];
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
                        let secondLine = words.join(" ");
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
                    let secondLine = words.slice(_).join(" ");
                    ctx.fillText(secondLine, x, y + currentFontSize);
                    return currentFontSize;
                }
            }
        }
    }
}
const isHexCode = function (hex) {
    const allowedChars = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
    ];
    if (hex.length != 3 && hex.length != 6) {
        return false;
    }
    for (let i = 0; i < hex.length; i++) {
        if (!allowedChars.includes(hex[i])) {
            return false;
        }
    }
    return true;
};
function getFontColor(bgcolor, averagecolor) {
    let e = deltaE(hexToRgb(bgcolor), hexToRgb("FFFFFF"));
    if (e < 10) {
        e = deltaE(hexToRgb(bgcolor), hexToRgb(averagecolor));
        if (e < 10) {
            return "#000000";
        }
        else {
            return averagecolor;
        }
    }
    else {
        return "#FFFFFF";
    }
}
function deltaE(rgbA, rgbB) {
    let labA = rgb2lab(rgbA);
    let labB = rgb2lab(rgbB);
    let deltaL = labA[0] - labB[0];
    let deltaA = labA[1] - labB[1];
    let deltaB = labA[2] - labB[2];
    let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    let deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    let sc = 1.0 + 0.045 * c1;
    let sh = 1.0 + 0.015 * c1;
    let deltaLKlsl = deltaL / 1.0;
    let deltaCkcsc = deltaC / sc;
    let deltaHkhsh = deltaH / sh;
    let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
}
function rgb2lab(rgb) {
    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
    ];
}
