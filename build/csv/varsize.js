import * as assert from "../assert";
export default function parse(values) {
    const rowList = values.get("VARIABLESIZE.CSV");
    const result = new Map();
    for (const row of rowList ?? []) {
        const name = row[0];
        const size = Number(row[1]);
        assert.number(size, "Size of variable in VARIABLESIZE.CSV should be an integer");
        // Note: -1 is ignored
        if (size >= 0) {
            result.set(name, size);
        }
    }
    return result;
}
