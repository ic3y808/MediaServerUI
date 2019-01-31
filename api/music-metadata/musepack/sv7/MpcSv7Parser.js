'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const initDebug = require("debug");
const assert = require("assert");
const BasicParser_1 = require("../../common/BasicParser");
const SV7 = require("./StreamVersion7");
const APEv2Parser_1 = require("../../apev2/APEv2Parser");
const BitReader_1 = require("./BitReader");
const debug = initDebug('music-metadata:parser:musepack');
class MpcSv7Parser extends BasicParser_1.BasicParser {
    constructor() {
        super(...arguments);
        this.audioLength = 0;
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            const header = yield this.tokenizer.readToken(SV7.Header);
            assert.equal(header.signature, 'MP+', 'Magic number');
            debug(`stream-version=${header.streamMajorVersion}.${header.streamMinorVersion}`);
            this.metadata.setFormat('dataformat', 'Musepack, SV7');
            this.metadata.setFormat('sampleRate', header.sampleFrequency);
            const numberOfSamples = 1152 * (header.frameCount - 1) + header.lastFrameLength;
            this.metadata.setFormat('numberOfSamples', numberOfSamples);
            this.duration = numberOfSamples / header.sampleFrequency;
            this.metadata.setFormat('duration', this.duration);
            this.bitreader = new BitReader_1.BitReader(this.tokenizer);
            this.metadata.setFormat('numberOfChannels', header.midSideStereo || header.intensityStereo ? 2 : 1);
            const version = yield this.bitreader.read(8);
            this.metadata.setFormat('encoder', (version / 100).toFixed(2));
            yield this.skipAudioData(header.frameCount);
            debug(`End of audio stream, switching to APEv2, offset=${this.tokenizer.position}`);
            return APEv2Parser_1.APEv2Parser.parseTagHeader(this.metadata, this.tokenizer, this.options);
        });
    }
    skipAudioData(frameCount) {
        return __awaiter(this, void 0, void 0, function* () {
            while (frameCount-- > 0) {
                const frameLength = yield this.bitreader.read(20);
                this.audioLength += 20 + frameLength;
                yield this.bitreader.ignore(frameLength);
            }
            // last frame
            const lastFrameLength = yield this.bitreader.read(11);
            this.audioLength += lastFrameLength;
            this.metadata.setFormat('bitrate', this.audioLength / this.duration);
        });
    }
}
exports.MpcSv7Parser = MpcSv7Parser;
