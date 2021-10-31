import P from "parsimmon";
import * as U from "./parser/util";
const nonButton = P.noneOf("[").many().tie();
const coreButton = P.regex(/\[\s*[0-9]+\s*\]/);
const buttonParser = P.alt(P.seqMap(coreButton, U.optional(nonButton), (core, text) => [core, core + (text ?? "")]).many().skip(P.eof), P.seqMap(U.optional(nonButton), coreButton, (text, core) => [core, (text ?? "") + core]).many().skip(P.eof), P.seqMap(P.seqMap(nonButton, coreButton, U.optional(nonButton), (left, core, right) => [core, left + core + (right ?? "")]), P.seqMap(coreButton, U.optional(nonButton), (core, text) => [core, core + (text ?? "")]).many(), (first, rest) => [first, ...rest]).skip(P.eof));
export default class Printer {
    buffer;
    chunks;
    align;
    font;
    defaultBackground;
    defaultColor;
    background;
    color;
    focus;
    lineCount;
    draw;
    skipDisp;
    isLineTemp;
    constructor() {
        this.buffer = [];
        this.chunks = [];
        this.align = "LEFT";
        this.font = {
            name: "",
            bold: false,
            italic: false,
            strike: false,
            underline: false,
        };
        this.defaultBackground = "000000";
        this.defaultColor = "FFFFFF";
        this.background = this.defaultBackground;
        this.color = this.defaultColor;
        this.focus = "FFFF00";
        this.lineCount = 0;
        this.draw = true;
        this.skipDisp = false;
        this.isLineTemp = false;
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *clearTemp() {
        if (this.isLineTemp) {
            this.buffer.push({ type: "clear", count: 1 });
            this.isLineTemp = false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *flush() {
        for (const output of this.buffer) {
            yield output;
        }
        this.buffer = [];
    }
    async *newline() {
        if (this.isLineTemp) {
            this.buffer.push({ type: "clear", count: 1 });
            this.lineCount -= 1;
        }
        const merged = [];
        if (this.chunks.length > 0) {
            merged.push(this.chunks[0]);
            for (let i = 1; i < this.chunks.length; ++i) {
                const chunk = this.chunks[i];
                const lastChunk = merged[merged.length - 1];
                if (chunk.type === "string" &&
                    lastChunk.type === "string" &&
                    chunk.cell == null &&
                    lastChunk.cell == null &&
                    chunk.style.font === lastChunk.style.font &&
                    chunk.style.color === lastChunk.style.color &&
                    chunk.style.bold === lastChunk.style.bold &&
                    chunk.style.italic === lastChunk.style.italic &&
                    chunk.style.underline === lastChunk.style.underline &&
                    chunk.style.strike === lastChunk.style.strike) {
                    lastChunk.text += chunk.text;
                }
                else {
                    merged.push(chunk);
                }
            }
        }
        const normalized = [];
        for (const chunk of merged) {
            if (chunk.type === "string") {
                const parsed = buttonParser.parse(chunk.text);
                if (parsed.status && parsed.value.length > 0) {
                    for (const [core, text] of parsed.value) {
                        const valueMatch = /\[\s*(?<value>[0-9]+)\s*\]/.exec(core);
                        normalized.push({
                            type: "button",
                            text,
                            value: valueMatch.groups.value,
                            cell: chunk.cell,
                            style: { ...chunk.style },
                        });
                    }
                }
                else {
                    normalized.push(chunk);
                }
            }
            else {
                normalized.push(chunk);
            }
        }
        this.buffer.push({
            type: "content",
            align: this.align,
            children: normalized,
        });
        this.chunks = [];
        this.lineCount += 1;
        this.isLineTemp = false;
        if (this.draw) {
            yield* this.flush();
        }
    }
    async *print(text, flags, cell) {
        yield* this.clearTemp();
        if (flags.has("S") && this.chunks.length > 0) {
            yield* this.newline();
        }
        if (text.length > 0) {
            this.chunks.push({
                type: "string",
                text,
                cell,
                style: {
                    color: this.color,
                    focus: this.focus,
                    font: this.font.name,
                    bold: this.font.bold,
                    italic: this.font.italic,
                    strike: this.font.strike,
                    underline: this.font.underline,
                },
            });
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
    async *button(text, value, cell) {
        yield* this.clearTemp();
        this.chunks.push({
            type: "button",
            text,
            value,
            cell,
            style: {
                color: this.color,
                focus: this.focus,
                font: this.font.name,
                bold: this.font.bold,
                italic: this.font.italic,
                strike: this.font.strike,
                underline: this.font.underline,
            },
        });
        if (this.draw) {
            yield* this.flush();
        }
    }
    async *line(value) {
        yield* this.clearTemp();
        this.buffer.push({ type: "line", value });
        if (this.draw) {
            yield* this.flush();
        }
        this.lineCount += 1;
    }
    async *clear(count) {
        if (count > 0) {
            this.buffer.push({ type: "clear", count });
            this.lineCount = Math.max(0, this.lineCount - count);
            this.isLineTemp = false;
        }
        if (this.draw) {
            yield* this.flush();
        }
    }
    async *wait(force) {
        yield* this.flush();
        if (this.chunks.length > 0) {
            yield* this.newline();
        }
        yield { type: "wait", force };
    }
    async *input(numeric, nullable) {
        yield* this.flush();
        if (this.chunks.length > 0) {
            yield* this.newline();
        }
        return yield { type: "input", numeric, nullable };
    }
    async *tinput(numeric, timeout, countdown) {
        yield* this.flush();
        if (this.chunks.length > 0) {
            yield* this.newline();
        }
        return yield { type: "tinput", numeric, timeout, countdown };
    }
}
