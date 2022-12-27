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
function getImageBuffer(imgURL, fallback) {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.get(imgURL, { responseType: "arraybuffer" });
            const image = Buffer.from(res.data, "binary");
            const format = yield (0, sharp_1.default)(image)
                .metadata()
                .then((metadata) => metadata.format);
            if (format === "webp") {
                (0, sharp_1.default)(image)
                    .png()
                    .toBuffer()
                    .then((buffer) => resolve(buffer));
            }
            else {
                resolve(image);
            }
        }
        catch (err) {
            console.log(err);
            resolve(Buffer.from(fallback, "base64"));
        }
    }));
}
exports.getImageBuffer = getImageBuffer;
function crop1x1(buffer) {
    return new Promise((resolve) => {
        (0, sharp_1.default)(buffer)
            .resize({ width: 1, height: 1, fit: "cover" })
            .toBuffer()
            .then((buffer) => resolve(buffer));
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
