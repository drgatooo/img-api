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
exports.loadImageFromBuffer = exports.crop1x1 = exports.getImageBuffer = void 0;
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
const canvas_1 = __importDefault(require("canvas"));
const fs_1 = __importDefault(require("fs"));
function getImageBuffer(imgURL, fallback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(imgURL, { responseType: "arraybuffer" });
            const buffer = Buffer.from(response.data, "binary");
            if (response.headers["content-type"] === "image/webp") {
                return yield (0, sharp_1.default)(buffer).png().toBuffer();
            }
            return buffer;
        }
        catch (error) {
            return fs_1.default.readFileSync(fallback);
        }
    });
}
exports.getImageBuffer = getImageBuffer;
function crop1x1(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield loadImageFromBuffer(buffer);
        const canvas = canvas_1.default.createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const width = image.width;
        const height = image.height;
        const size = Math.min(width, height);
        const x = (width - size) / 2;
        const y = (height - size) / 2;
        const croppedCanvas = canvas_1.default.createCanvas(size, size);
        const croppedCtx = croppedCanvas.getContext("2d");
        croppedCtx.drawImage(canvas, x, y, size, size, 0, 0, size, size);
        return yield (0, sharp_1.default)(croppedCanvas.toBuffer("image/png")).png().toBuffer();
    });
}
exports.crop1x1 = crop1x1;
function loadImageFromBuffer(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const image = new canvas_1.default.Image();
            image.src = buffer;
            resolve(image);
        });
    });
}
exports.loadImageFromBuffer = loadImageFromBuffer;
