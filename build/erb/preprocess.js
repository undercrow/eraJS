export default function preprocess(raw, macros) {
    let temp = [];
    // Step 1: Break by newline
    const result1 = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    // Step 2: Strip comments
    const result2 = result1.map((line) => line.replace(/;.*$/, ""));
    // Step 3: Trim leading/trailing whitespaces
    const result3 = result2.map((line) => line.replace(/^\s+/, "").replace(/\s+$/, ""));
    // Step 4: Remove empty lines
    const result4 = result3.filter((line) => line !== "");
    // Step 5: Remove [SKIPSTART]~[SKIPEND] and [IF_DEBUG]~[ENDIF] lines
    const result5 = [];
    temp = result4.slice();
    while (temp.length > 0) {
        const line = temp.shift();
        if (line === "[SKIPSTART]") {
            [, temp] = splitBy(temp, "[SKIPEND]");
        }
        else if (line === "[IF_DEBUG]") {
            [, temp] = splitBy(temp, "[ENDIF]");
        }
        else {
            result5.push(line);
        }
    }
    // Step 6: Check [IF]/[ENDIF] blocks
    // TODO: Handle [ELSEIF], [ELSE]
    let result6 = [];
    temp = result5.slice();
    while (temp.length > 0) {
        const line = temp.shift();
        if (/^\[IF .*\]$/.test(line)) {
            const name = line.slice("[IF ".length, -1 * "]".length);
            const [body, rest] = splitBy(temp, "[ENDIF]");
            if (macros.has(name)) {
                result6 = result6.concat(body);
            }
            temp = rest;
        }
        else {
            result6.push(line);
        }
    }
    // Step 7: Concatenate lines inside braces
    const result7 = [];
    temp = result6.slice();
    while (temp.length > 0) {
        const line = temp.shift();
        if (line === "{") {
            const [group, rest] = splitBy(temp, "}");
            result7.push(group.join(""));
            temp = rest;
        }
        else {
            result7.push(line);
        }
    }
    return result7;
}
function splitBy(lineList, separator) {
    const index = lineList.findIndex((line) => line === separator);
    return [lineList.slice(0, index), lineList.slice(index + 1)];
}
