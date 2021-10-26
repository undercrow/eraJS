export default class Slice {
    file;
    // NOTE: `line` is 0-indexed
    line;
    from;
    to;
    content;
    constructor(file, line, content, from, to) {
        this.file = file;
        this.line = line;
        this.content = content;
        this.from = from ?? 0;
        this.to = to ?? content.length;
    }
    slice(from, to) {
        const newFrom = this.from + (from ?? 0);
        let newTo;
        if (to == null) {
            newTo = this.to;
        }
        else {
            newTo = Math.min(this.to, this.from + to);
        }
        return new Slice(this.file, this.line, this.content, newFrom, newTo);
    }
    get() {
        return this.content.slice(this.from, this.to);
    }
    length() {
        return this.to - this.from;
    }
}
