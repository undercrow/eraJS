export default class OutputQueue {
    buffer;
    lineCount;
    draw;
    skipDisp;
    isLineEmpty;
    isLineTemp;
    constructor() {
        this.buffer = [];
        this.lineCount = 0;
        this.draw = true;
        this.skipDisp = false;
        this.isLineEmpty = true;
        this.isLineTemp = false;
    }
    *clearTemp() {
        if (this.isLineTemp) {
            this.buffer.push({ type: "clear", count: 1 });
            this.buffer.push({ type: "newline" });
            this.isLineTemp = false;
            this.isLineEmpty = true;
        }
    }
    *flush() {
        for (const output of this.buffer) {
            yield output;
        }
        this.buffer = [];
    }
    *newline() {
        if (this.isLineTemp) {
            this.buffer.push({ type: "clear", count: 1 });
            this.lineCount -= 1;
        }
        this.buffer.push({ type: "newline" });
        this.lineCount += 1;
        this.isLineTemp = false;
        this.isLineEmpty = true;
        if (this.draw) {
            yield* this.flush();
        }
    }
    *print(text, flags, cell) {
        yield* this.clearTemp();
        if (flags.has("S") && !this.isLineEmpty) {
            yield* this.newline();
        }
        if (text.length > 0) {
            this.buffer.push({ type: "string", text, cell });
            this.isLineEmpty = false;
        }
        if (flags.has("S") || flags.has("L") || flags.has("W")) {
            yield* this.newline();
        }
        if (flags.has("W")) {
            yield* this.wait(false);
        }
        if (this.draw) {
            yield* this.flush();
        }
    }
    *button(text, value, cell) {
        yield* this.clearTemp();
        this.buffer.push({ type: "button", text, value, cell });
        this.isLineEmpty = false;
        if (this.draw) {
            yield* this.flush();
        }
    }
    *line(value) {
        yield* this.clearTemp();
        this.buffer.push({ type: "line", value });
        if (this.draw) {
            yield* this.flush();
        }
        this.lineCount += 1;
        this.isLineEmpty = true;
    }
    *clear(count) {
        if (count > 0) {
            this.buffer.push({ type: "clear", count });
            this.lineCount = Math.max(0, this.lineCount - count);
            this.isLineTemp = false;
        }
        if (this.draw) {
            yield* this.flush();
        }
    }
    *wait(force) {
        yield* this.flush();
        yield { type: "wait", force };
    }
    *input(numeric, nullable) {
        yield* this.flush();
        return yield { type: "input", numeric, nullable };
    }
    *tinput(numeric, timeout, showClock) {
        yield* this.flush();
        return yield { type: "tinput", numeric, timeout, showClock };
    }
}
