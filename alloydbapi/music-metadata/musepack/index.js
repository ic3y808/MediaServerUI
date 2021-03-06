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
const MpcSv8Parser_1 = require("./sv8/MpcSv8Parser");
const MpcSv7Parser_1 = require("./sv7/MpcSv7Parser");
const AbstractID3Parser_1 = require("../id3v2/AbstractID3Parser");
const debug = initDebug('music-metadata:parser:musepack');
class MusepackParser extends AbstractID3Parser_1.AbstractID3Parser {
    _parse() {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this.tokenizer.peekToken(new Token.StringType(3, 'binary'));
            let mpcParser;
            switch (signature) {
                case 'MP+': {
                    debug('Musepack stream-version 7');
                    mpcParser = new MpcSv7Parser_1.MpcSv7Parser();
                    break;
                }
                case 'MPC': {
                    debug('Musepack stream-version 8');
                    mpcParser = new MpcSv8Parser_1.MpcSv8Parser();
                    break;
                }
                default: {
                    throw new Error('Invalid Musepack signature prefix');
                }
            }
            mpcParser.init(this.metadata, this.tokenizer, this.options);
            return mpcParser.parse();
        });
    }
}
exports.default = MusepackParser;
