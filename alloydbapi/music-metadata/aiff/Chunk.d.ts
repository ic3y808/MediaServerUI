/// <reference types="node" />
import * as Token from "token-types";
export interface IChunkHeader {
    /**
     * 	A chunk ID (ie, 4 ASCII bytes)
     */
    chunkID: string;
    /**
     * Number of data bytes following this data header
     */
    size: number;
}
/**
 * Common AIFF chunk header
 */
export declare const Header: Token.IGetToken<IChunkHeader>;
/**
 * The Common Chunk.
 * Describes fundamental parameters of the waveform data such as sample rate, bit resolution, and how many channels of
 * digital audio are stored in the FORM AIFF.
 */
export interface ICommon {
    numChannels: number;
    numSampleFrames: number;
    sampleSize: number;
    sampleRate: number;
    compressionType?: string;
    compressionName?: string;
}
export declare class Common implements Token.IGetToken<ICommon> {
    private isAifc;
    len: number;
    constructor(header: IChunkHeader, isAifc: boolean);
    get(buf: Buffer, off: number): ICommon;
}
