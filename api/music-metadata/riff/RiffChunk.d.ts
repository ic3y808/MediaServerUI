import * as Token from 'token-types';
export interface IChunkHeader {
    /**
     *  A chunk ID (ie, 4 ASCII bytes)
     */
    chunkID: string;
    /**
     * Number of data bytes following this data header
     */
    size: number;
}
/**
 * Common RIFF chunk header
 */
export declare const Header: Token.IGetToken<IChunkHeader>;
/**
 * Token to parse RIFF-INFO tag value
 */
export declare class ListInfoTagValue implements Token.IGetToken<string> {
    private tagHeader;
    len: number;
    constructor(tagHeader: IChunkHeader);
    get(buf: any, off: any): string;
}
