export default class Lazy {
    parser;
    raw;
    isCompiled;
    cache;
    constructor(raw, parser) {
        this.raw = raw;
        this.parser = parser;
        this.isCompiled = false;
    }
    get() {
        if (this.isCompiled) {
            return this.cache;
        }
        const result = this.parser.tryParse(this.raw);
        this.isCompiled = true;
        this.cache = result;
        return result;
    }
}
