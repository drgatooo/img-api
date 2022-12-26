/// <reference types="node" />
interface SongData {
    name: string;
    artist: string;
    cover: string;
    text?: "canción" | "playlist";
    listenOn?: string;
}
export declare function SpotifyCard(data: SongData, color: any, orientation: "portrait" | "square" | "landscape", colorGiven: any): Promise<Buffer>;
export {};
