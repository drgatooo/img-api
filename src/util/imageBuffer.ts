import axios from "axios";
import sharp from "sharp";
import Canvas from "canvas";
import fs from "fs";

/**
 * get image buffer from url. if image is webp, convert it to png. if image is invalid or not found, use fallback image
 * @param imgURL
 * @param fallback
 */
export async function getImageBuffer(imgURL: string, fallback: string) {
  try {
    const response = await axios.get(imgURL, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // if image is webp, convert it to png
    if (response.headers["content-type"] === "image/webp") {
      return await sharp(buffer).png().toBuffer();
    }

    return buffer;
  } catch (error) {
    // if image is invalid or not found, return fallback image from disk
    return fs.readFileSync(fallback);
  }
}

/**
 * crop image to 1x1 aspect ratio from center
 * @param buffer
 */
export async function crop1x1(buffer: Buffer) {
  const image = await loadImageFromBuffer(buffer);
  const canvas = Canvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const width = image.width;
  const height = image.height;
  const size = Math.min(width, height);
  const x = (width - size) / 2;
  const y = (height - size) / 2;

  const croppedCanvas = Canvas.createCanvas(size, size);
  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCtx.drawImage(canvas, x, y, size, size, 0, 0, size, size);

  return await sharp(croppedCanvas.toBuffer("image/png")).png().toBuffer();
}

export async function loadImageFromBuffer(buffer: Buffer) {
  return new Promise<Canvas.Image>((resolve) => {
    const image = new Canvas.Image();
    // image.onload = () => resolve(image);
    image.src = buffer;
    resolve(image);
  });
}
