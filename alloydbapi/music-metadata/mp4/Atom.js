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
const initDebug = require("debug");
const Token = require("token-types");
const AtomToken = require("./AtomToken");
const debug = initDebug("music-metadata:parser:MP4:Atom");
class Atom {
    constructor(header, extended, parent) {
        this.header = header;
        this.extended = extended;
        this.parent = parent;
        this.children = [];
        this.atomPath = (this.parent ? this.parent.atomPath + '/' : '') + this.header.name;
        this.dataLen = this.header.length - (extended ? 16 : 8);
    }
    readAtoms(tokenizer, dataHandler, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const atomBean = yield this.readAtom(tokenizer, dataHandler);
            this.children.push(atomBean);
            if (size === undefined) {
                return this.readAtoms(tokenizer, dataHandler, size).catch(err => {
                    if (err.message === type_1.endOfFile) {
                        debug(`Reached end-of-file`);
                    }
                    else {
                        throw err;
                    }
                });
            }
            size -= atomBean.header.length;
            if (size > 0) {
                return this.readAtoms(tokenizer, dataHandler, size);
            }
        });
    }
    readAtom(tokenizer, dataHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            // Parse atom header
            const offset = tokenizer.position;
            // debug(`Reading next token on offset=${offset}...`); //  buf.toString('ascii')
            const header = yield tokenizer.readToken(AtomToken.Header);
            const extended = header.length === 1;
            if (extended) {
                header.length = yield tokenizer.readToken(AtomToken.ExtendedSize);
            }
            const atomBean = new Atom(header, extended, this);
            debug(`parse atom name=${atomBean.atomPath}, extended=${atomBean.extended}, offset=${offset}, len=${atomBean.header.length}`); //  buf.toString('ascii')
            yield atomBean.readData(tokenizer, dataHandler);
            return atomBean;
        });
    }
    readData(tokenizer, dataHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.header.name) {
                // "Container" atoms, contains nested atoms
                case "moov": // The Movie Atom: contains other atoms
                case "udta": // User defined atom
                case "trak":
                case "mdia": // Media atom
                case "minf": // Media Information Atom
                case "stbl": // The Sample Table Atom
                case "<id>":
                case "ilst":
                    return this.readAtoms(tokenizer, dataHandler, this.dataLen);
                case "meta": // Metadata Atom, ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW8
                    // meta has 4 bytes of padding, ignore
                    yield tokenizer.readToken(new Token.IgnoreType(4));
                    return this.readAtoms(tokenizer, dataHandler, this.dataLen - 4);
                case "mdhd": // Media header atom
                case "mvhd": // 'movie' => 'mvhd': movie header atom; child of Movie Atom
                case "tkhd":
                case "stsz":
                case "mdat":
                default:
                    return dataHandler(this);
            }
        });
    }
}
exports.Atom = Atom;
