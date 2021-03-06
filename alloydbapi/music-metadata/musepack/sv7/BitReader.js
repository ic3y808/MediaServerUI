var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Token = require("token-types");
class BitReader {
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.pos = 0;
        this.dword = undefined;
    }
    /**
     *
     * @param bits 1..30 bits
     */
    read(bits) {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.dword === undefined) {
                this.dword = yield this.tokenizer.readToken(Token.UINT32_LE);
            }
            let out = this.dword;
            this.pos += bits;
            if (this.pos < 32) {
                out >>>= (32 - this.pos);
                return out & ((1 << bits) - 1);
            }
            else {
                this.pos -= 32;
                if (this.pos === 0) {
                    this.dword = undefined;
                    return out & ((1 << bits) - 1);
                }
                else {
                    this.dword = yield this.tokenizer.readToken(Token.UINT32_LE);
                    if (this.pos) {
                        out <<= this.pos;
                        out |= this.dword >>> (32 - this.pos);
                    }
                    return out & ((1 << bits) - 1);
                }
            }
        });
    }
    ignore(bits) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pos > 0) {
                const remaining = 32 - this.pos;
                this.dword = undefined;
                bits -= remaining;
                this.pos = 0;
            }
            const remainder = bits % 32;
            const numOfWords = (bits - remainder) / 32;
            yield this.tokenizer.ignore(numOfWords * 4);
            return this.read(remainder);
        });
    }
}
exports.BitReader = BitReader;
