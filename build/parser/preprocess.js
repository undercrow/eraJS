import Slice from "../slice";
export function normalize(raw) {
    if (raw.startsWith("\uFEFF") || raw.startsWith("\uFFEF")) {
        return raw.slice(1);
    }
    return raw;
}
export function toLines(raw) {
    const converted = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    return converted.map((content, index) => new Slice("", index, content));
}
export function preprocess(lines, macros) {
    const fn = [
        // Strip comments
        (prev) => prev.map((line) => new Slice("", line.line, line.content.replace(/;.*$/, ""))),
        // Trim whitespaces
        (prev) => prev.map((line) => new Slice("", line.line, line.content.trim())),
        // Remove empty lines
        (prev) => prev.filter((line) => line.content.length > 0),
        // Remove [SKIPSTART]~[SKIPEND] and [IF_DEBUG]~[ENDIF] lines
        (prev) => {
            const result = [];
            let index = 0;
            while (index < prev.length) {
                const line = prev[index];
                if (line.content === "[SKIPSTART]") {
                    index += prev.slice(index).findIndex((l) => l.content === "[SKIPEND]") + 1;
                }
                else if (line.content === "[IF_DEBUG]") {
                    index += prev.slice(index).findIndex((l) => l.content === "[ENDIF]") + 1;
                }
                else {
                    result.push(line);
                    index += 1;
                }
            }
            return result;
        },
        // Check [IF]/[ENDIF] blocks
        // TODO: Handle [ELSEIF], [ELSE]
        (prev) => {
            let result = [];
            let index = 0;
            while (index < prev.length) {
                const line = prev[index];
                if (/^\[IF .*\]$/.test(line.content)) {
                    const name = line.content.slice("[IF ".length, -1 * "]".length);
                    index += 1;
                    const endIndex = index + prev.slice(index).findIndex((l) => l.content === "[ENDIF]");
                    if (macros.has(name)) {
                        result = result.concat(prev.slice(index, endIndex));
                    }
                    index = endIndex + 1;
                }
                else {
                    result.push(line);
                    index += 1;
                }
            }
            return result;
        },
        // Concatenate lines inside braces
        (prev) => {
            const result = [];
            let index = 0;
            while (index < prev.length) {
                const line = prev[index];
                if (line.content === "{") {
                    const endIndex = index + prev.slice(index).findIndex((l) => l.content === "}");
                    const subLines = prev.slice(index + 1, endIndex);
                    result.push(new Slice(subLines[0].file, subLines[0].line, subLines.map((l) => l.content).join("")));
                    index = endIndex + 1;
                }
                else {
                    result.push(line);
                    index += 1;
                }
            }
            return result;
        },
    ];
    return fn.reduce((acc, val) => val(acc), lines);
}
