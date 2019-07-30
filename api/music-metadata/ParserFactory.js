var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileType = require("file-type");
const MimeType = require("media-typer");
const _debug = require("debug");
const MetadataCollector_1 = require("./common/MetadataCollector");
const debug = _debug("music-metadata:parser:factory");
class ParserFactory {
    constructor() {
        // ToDo: expose warnings to API
        this.warning = [];
    }
    /**
     *  Parse metadata from tokenizer
     * @param {ITokenizer} tokenizer
     * @param {string} contentType
     * @param {IOptions} opts
     * @returns {Promise<INativeAudioMetadata>}
     */
    static parse(tokenizer, contentType, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Resolve parser based on MIME-type or file extension
            let parserId = ParserFactory.getParserIdForMimeType(contentType) || ParserFactory.getParserIdForExtension(contentType);
            if (!parserId) {
                // No MIME-type mapping found
                debug("No parser found for MIME-type / extension: " + contentType);
                const buf = Buffer.alloc(4100);
                yield tokenizer.peekBuffer(buf, 0, buf.byteLength, tokenizer.position, true);
                const guessedType = fileType(buf);
                if (!guessedType)
                    throw new Error("Failed to guess MIME-type");
                parserId = ParserFactory.getParserIdForMimeType(guessedType.mime);
                if (!parserId)
                    throw new Error("Guessed MIME-type not supported: " + guessedType.mime);
                return this._parse(tokenizer, parserId, opts);
            }
            // Parser found, execute parser
            return this._parse(tokenizer, parserId, opts);
        });
    }
    /**
     * @param filePath Path, filename or extension to audio file
     * @return Parser sub-module name
     */
    static getParserIdForExtension(filePath) {
        if (!filePath)
            return;
        const extension = this.getExtension(filePath).toLocaleLowerCase() || filePath;
        switch (extension) {
            case ".mp2":
            case ".mp3":
            case ".m2a":
                return 'mpeg';
            case ".ape":
                return 'apev2';
            case ".aac":
            case ".mp4":
            case ".m4a":
            case ".m4b":
            case ".m4pa":
            case ".m4v":
            case ".m4r":
            case ".3gp":
                return 'mp4';
            case ".wma":
            case ".wmv":
            case ".asf":
                return 'asf';
            case ".flac":
                return 'flac';
            case ".ogg":
            case ".ogv":
            case ".oga":
            case ".ogm":
            case ".ogx":
            case ".opus": // recommended filename extension for Ogg Opus
            case ".spx": // recommended filename extension for Ogg Speex
                return 'ogg';
            case ".aif":
            case ".aiff":
            case ".aifc":
                return 'aiff';
            case ".wav":
                return 'riff';
            case ".wv":
            case ".wvp":
                return 'wavpack';
            case ".mpc":
                return 'musepack';
        }
    }
    static loadParser(moduleName, options) {
        return __awaiter(this, void 0, void 0, function* () {
            debug(`Lazy loading parser: ${moduleName}`);
            if (options.loadParser) {
                const parser = yield options.loadParser(moduleName);
                if (!parser) {
                    throw new Error(`options.loadParser failed to resolve module "${moduleName}".`);
                }
                return parser;
            }
            const module = yield Promise.resolve().then(() => require('./' + moduleName + '/index'));
            return new module.default();
        });
    }
    static _parse(tokenizer, parserId, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Parser found, execute parser
            const parser = yield ParserFactory.loadParser(parserId, opts);
            const metadata = new MetadataCollector_1.MetadataCollector(opts);
            yield parser.init(metadata, tokenizer, opts).parse();
            return metadata.toCommonMetadata();
        });
    }
    static getExtension(fname) {
        const i = fname.lastIndexOf('.');
        return i === -1 ? '' : fname.slice(i);
    }
    /**
     * @param {string} mimeType MIME-Type, extension, path or filename
     * @returns {string} Parser sub-module name
     */
    static getParserIdForMimeType(mimeType) {
        let mime;
        try {
            mime = MimeType.parse(mimeType);
        }
        catch (err) {
            debug(`Invalid MIME-type: ${mimeType}`);
            return;
        }
        const subType = mime.subtype.indexOf('x-') === 0 ? mime.subtype.substring(2) : mime.subtype;
        switch (mime.type) {
            case 'audio':
                switch (subType) {
                    case 'mp3': // Incorrect MIME-type, Chrome, in Web API File object
                    case 'mpeg':
                        return 'mpeg'; // ToDo: handle ID1 header as well
                    case 'flac':
                        return 'flac';
                    case 'ape':
                    case 'monkeys-audio':
                        return 'apev2';
                    case 'mp4':
                    case 'aac':
                    case 'aacp':
                    case 'm4a':
                        return 'mp4';
                    case 'ogg': // RFC 7845
                    case 'opus': // RFC 6716
                    case 'speex': // RFC 5574
                        return 'ogg';
                    case 'ms-wma':
                    case 'ms-wmv':
                    case 'ms-asf':
                        return 'asf';
                    case 'aiff':
                    case 'aif':
                    case 'aifc':
                        return 'aiff';
                    case 'vnd.wave':
                    case 'wav':
                    case 'wave':
                        return 'riff';
                    case 'wavpack':
                        return 'wavpack';
                    case 'musepack':
                        return 'musepack';
                }
                break;
            case 'video':
                switch (subType) {
                    case 'ms-asf':
                    case 'ms-wmv':
                        return 'asf';
                    case 'm4v':
                    case 'mp4':
                        return 'mp4';
                    case 'ogg':
                        return 'ogg';
                }
                break;
            case 'application':
                switch (subType) {
                    case 'vnd.ms-asf':
                        return 'asf';
                    case 'ogg':
                        return 'ogg';
                }
                break;
        }
    }
}
exports.ParserFactory = ParserFactory;
