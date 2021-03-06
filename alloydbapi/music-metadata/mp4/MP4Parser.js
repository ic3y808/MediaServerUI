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
const Token = require("token-types");
const BasicParser_1 = require("../common/BasicParser");
const Atom_1 = require("./Atom");
const AtomToken = require("./AtomToken");
const ID3v1Parser_1 = require("../id3v1/ID3v1Parser");
const Util_1 = require("../common/Util");
const debug = initDebug('music-metadata:parser:MP4');
const tagFormat = 'iTunes';
const encoderDict = {
    alac: {
        lossy: false,
        format: 'ALAC'
    },
    mp4a: {
        lossy: true,
        format: 'MP4A'
    },
    mp4s: {
        lossy: true,
        format: 'MP4S'
    },
    // Closed Captioning Media, https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-SW87
    c608: {
        lossy: true,
        format: 'CEA-608'
    },
    c708: {
        lossy: true,
        format: 'CEA-708'
    }
};
const dataFormat = 'MPEG-4';
/*
 * Parser for: MPEG-4 Audio / Part 3 (.m4a)& MPEG 4 Video (m4v, mp4) extension.
 * Support for Apple iTunes tags as found in a M4A/M4V files.
 * Ref:
 *   https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/Metadata/Metadata.html
 *   http://atomicparsley.sourceforge.net/mpeg-4files.html
 *   https://github.com/sergiomb2/libmp4v2/wiki/iTunesMetadata
 */
class MP4Parser extends BasicParser_1.BasicParser {
    static read_BE_Signed_Integer(value) {
        return Token.readIntBE(value, 0, value.length);
    }
    static read_BE_Unsigned_Integer(value) {
        return Token.readUIntBE(value, 0, value.length);
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            this.metadata.setFormat('dataformat', dataFormat);
            const rootAtom = new Atom_1.Atom({ name: 'mp4', length: this.tokenizer.fileSize }, false, null);
            return rootAtom.readAtoms(this.tokenizer, (atom) => __awaiter(this, void 0, void 0, function* () {
                if (atom.parent) {
                    switch (atom.parent.header.name) {
                        case 'ilst':
                        case '<id>':
                            return this.parseMetadataItemData(atom);
                        case 'stbl': // The Sample Table Atom
                            switch (atom.header.name) {
                                case 'stsd': // sample descriptions
                                    return this.parseAtom_stsd(atom.dataLen);
                            }
                    }
                }
                switch (atom.header.name) {
                    case "ftyp":
                        const types = yield this.parseAtom_ftyp(atom.dataLen);
                        debug(`ftyp: ${types.join('/')}`);
                        return;
                    case 'mdhd': // Media header atom
                        return this.parseAtom_mdhd(atom);
                    case 'mvhd': // 'movie' => 'mvhd': movie header atom; child of Movie Atom
                        return this.parseAtom_mvhd(atom);
                    case 'mdat': // media data atom:
                        if (this.tokenizer.fileSize && this.metadata.format.duration) {
                            this.metadata.setFormat('bitrate', 8 * atom.dataLen / this.metadata.format.duration);
                        }
                        break;
                }
                yield this.tokenizer.readToken(new Token.IgnoreType(atom.dataLen));
                debug(`Ignore atom data: path=${atom.atomPath}, payload-len=${atom.dataLen}`);
            }), this.tokenizer.fileSize);
        });
    }
    addTag(id, value) {
        this.metadata.addTag(tagFormat, id, value);
    }
    addWarning(message) {
        debug('Warning:' + message);
        this.warnings.push(message);
    }
    /**
     * Parse data of Meta-item-list-atom (item of 'ilst' atom)
     * @param metaAtom
     * Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW8
     */
    parseMetadataItemData(metaAtom) {
        let tagKey = metaAtom.header.name;
        return metaAtom.readAtoms(this.tokenizer, (child) => __awaiter(this, void 0, void 0, function* () {
            switch (child.header.name) {
                case "data": // value atom
                    return this.parseValueAtom(tagKey, child);
                case "name": // name atom (optional)
                    const name = yield this.tokenizer.readToken(new AtomToken.NameAtom(child.dataLen));
                    tagKey += ":" + name.name;
                    break;
                case "mean": // name atom (optional)
                    const mean = yield this.tokenizer.readToken(new AtomToken.NameAtom(child.dataLen));
                    // console.log("  %s[%s] = %s", tagKey, header.name, mean.name);
                    tagKey += ":" + mean.name;
                    break;
                default:
                    const dataAtom = yield this.tokenizer.readToken(new Token.BufferType(child.dataLen));
                    this.addWarning("Unsupported meta-item: " + tagKey + "[" + child.header.name + "] => value=" + dataAtom.toString("hex") + " ascii=" + dataAtom.toString("ascii"));
            }
        }), metaAtom.dataLen);
    }
    parseValueAtom(tagKey, metaAtom) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataAtom = yield this.tokenizer.readToken(new AtomToken.DataAtom(metaAtom.header.length - AtomToken.Header.len));
            if (dataAtom.type.set !== 0) {
                throw new Error("Unsupported type-set != 0: " + dataAtom.type.set);
            }
            // Use well-known-type table
            // Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW35
            switch (dataAtom.type.type) {
                case 0: // reserved: Reserved for use where no type needs to be indicated
                    switch (tagKey) {
                        case "trkn":
                        case "disk":
                            const num = Token.UINT8.get(dataAtom.value, 3);
                            const of = Token.UINT8.get(dataAtom.value, 5);
                            // console.log("  %s[data] = %s/%s", tagKey, num, of);
                            this.addTag(tagKey, num + "/" + of);
                            break;
                        case "gnre":
                            const genreInt = Token.UINT8.get(dataAtom.value, 1);
                            const genreStr = ID3v1Parser_1.Genres[genreInt - 1];
                            // console.log("  %s[data] = %s", tagKey, genreStr);
                            this.addTag(tagKey, genreStr);
                            break;
                        default:
                        // console.log("  reserved-data: name=%s, len=%s, set=%s, type=%s, locale=%s, value{ hex=%s, ascii=%s }",
                        // header.name, header.length, dataAtom.type.set, dataAtom.type.type, dataAtom.locale, dataAtom.value.toString('hex'), dataAtom.value.toString('ascii'));
                    }
                    break;
                case 1: // UTF-8: Without any count or NULL terminator
                case 18: // Unknown: Found in m4b in combination with a '©gen' tag
                    this.addTag(tagKey, dataAtom.value.toString("utf-8"));
                    break;
                case 13: // JPEG
                    if (this.options.skipCovers)
                        break;
                    this.addTag(tagKey, {
                        format: "image/jpeg",
                        data: Buffer.from(dataAtom.value)
                    });
                    break;
                case 14: // PNG
                    if (this.options.skipCovers)
                        break;
                    this.addTag(tagKey, {
                        format: "image/png",
                        data: Buffer.from(dataAtom.value)
                    });
                    break;
                case 21: // BE Signed Integer
                    this.addTag(tagKey, MP4Parser.read_BE_Signed_Integer(dataAtom.value));
                    break;
                case 22: // BE Unsigned Integer
                    this.addTag(tagKey, MP4Parser.read_BE_Unsigned_Integer(dataAtom.value));
                    break;
                case 65: // An 8-bit signed integer
                    this.addTag(tagKey, dataAtom.value.readInt8(0));
                    break;
                case 66: // A big-endian 16-bit signed integer
                    this.addTag(tagKey, dataAtom.value.readInt16BE(0));
                    break;
                case 67: // A big-endian 32-bit signed integer
                    this.addTag(tagKey, dataAtom.value.readInt32BE(0));
                    break;
                default:
                    this.addWarning(`atom key=${tagKey}, has unknown well-known-type (data-type): ${dataAtom.type.type}`);
            }
        });
    }
    /**
     * Parse movie header (mvhd) atom
     * @param mvhd mvhd atom
     */
    parseAtom_mvhd(mvhd) {
        return __awaiter(this, void 0, void 0, function* () {
            const mvhd_data = yield this.tokenizer.readToken(new AtomToken.MvhdAtom(mvhd.dataLen));
            this.parse_mxhd(mvhd_data);
        });
    }
    /**
     * Parse media header (mdhd) atom
     * @param mdhd mdhd atom
     */
    parseAtom_mdhd(mdhd) {
        return __awaiter(this, void 0, void 0, function* () {
            const mdhd_data = yield this.tokenizer.readToken(new AtomToken.MdhdAtom(mdhd.dataLen));
            this.parse_mxhd(mdhd_data);
        });
    }
    parse_mxhd(mxhd) {
        this.metadata.setFormat('sampleRate', mxhd.timeScale);
        this.metadata.setFormat('duration', mxhd.duration / mxhd.timeScale); // calculate duration in seconds
    }
    parseAtom_ftyp(len) {
        return __awaiter(this, void 0, void 0, function* () {
            const ftype = yield this.tokenizer.readToken(AtomToken.ftyp);
            len -= AtomToken.ftyp.len;
            if (len > 0) {
                const types = yield this.parseAtom_ftyp(len);
                const value = Util_1.default.stripNulls(ftype.type).trim();
                if (value.length > 0) {
                    types.push(value);
                }
                return types;
            }
            return [];
        });
    }
    parseAtom_stsd(len) {
        return __awaiter(this, void 0, void 0, function* () {
            const stsd = yield this.tokenizer.readToken(new AtomToken.StsdAtom(len));
            const formatList = [dataFormat];
            for (const dfEntry of stsd.table) {
                const encoderInfo = encoderDict[dfEntry.dataFormat];
                if (encoderInfo) {
                    this.metadata.setFormat('lossless', !encoderInfo.lossy);
                    formatList.push(encoderInfo.format);
                }
                else {
                    debug(`Warning: data-format '${dfEntry.dataFormat}' missing in MP4Parser.encoderDict`);
                    formatList.push(dfEntry.dataFormat);
                }
            }
            this.metadata.setFormat('dataformat', formatList.join('/'));
        });
    }
}
exports.MP4Parser = MP4Parser;
