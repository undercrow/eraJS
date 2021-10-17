import * as U from "./parser/util";
export default class Lazy {
    raw;
    parser;
    isCompiled;
    cache;
    constructor(raw, parser) {
        this.parser = parser;
        this.raw = raw;
        this.isCompiled = false;
    }
    get() {
        if (this.isCompiled) {
            return this.cache;
        }
        const result = U.tryParse(this.parser, this.raw);
        this.isCompiled = true;
        this.cache = result;
        return result;
    }
}
