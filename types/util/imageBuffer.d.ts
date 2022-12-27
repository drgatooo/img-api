/// <reference types="node" />
import canvas from "canvas";
export declare function getImageBuffer(imgURL: string, fallback: string): Promise<Buffer>;
export declare function crop1x1(buffer: Buffer): Promise<Buffer>;
export declare function loadImageFromBuffer(buffer: Buffer): Promise<canvas.Image>;
