/// <reference types="node" />
interface SongData {
    name: string;
    artist: string;
    imageURL: string;
}
export declare function SpotifyCard(data: SongData, listenOn?: string): Promise<Buffer>;
export {};
