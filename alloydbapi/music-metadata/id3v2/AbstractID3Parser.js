var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("strtok3/lib/type");
const ID3v2_1 = require("./ID3v2");
const ID3v2Parser_1 = require("./ID3v2Parser");
const ID3v1Parser_1 = require("../id3v1/ID3v1Parser");
const _debug = require("debug");
const BasicParser_1 = require("../common/BasicParser");
const debug = _debug('music-metadata:parser:ID3');
/**
 * Abstract parser which tries take ID3v2 and ID3v1 headers.
 */
class AbstractID3Parser extends BasicParser_1.BasicParser {
    constructor() {
        super(...arguments);
        this.id3parser = new ID3v2Parser_1.ID3v2Parser();
    }
    static startsWithID3v2Header(tokenizer) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield tokenizer.peekToken(ID3v2_1.ID3v2Token.Header)).fileIdentifier === 'ID3';
        });
    }
    parse() {
        return this.parseID3v2().catch(err => {
            if (err.message === type_1.endOfFile)
                // ToDo: maybe a warning?
                return;
            else
                throw err;
        });
    }
    finalize() {
        return;
    }
    parseID3v2() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.tryReadId3v2Headers();
            debug("End of ID3v2 header, go to MPEG-parser: pos=%s", this.tokenizer.position);
            yield this._parse();
            if (this.options.skipPostHeaders && this.metadata.hasAny()) {
                this.finalize();
            }
            else {
                const id3v1parser = new ID3v1Parser_1.ID3v1Parser();
                yield id3v1parser.init(this.metadata, this.tokenizer, this.options).parse();
                this.finalize();
            }
        });
    }
    tryReadId3v2Headers() {
        return __awaiter(this, void 0, void 0, function* () {
            const id3Header = yield this.tokenizer.peekToken(ID3v2_1.ID3v2Token.Header);
            if (id3Header.fileIdentifier === "ID3") {
                debug("Found ID3v2 header, pos=%s", this.tokenizer.position);
                yield this.id3parser.parse(this.metadata, this.tokenizer, this.options);
                return this.tryReadId3v2Headers();
            }
        });
    }
}
exports.AbstractID3Parser = AbstractID3Parser;
