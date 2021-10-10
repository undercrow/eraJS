import * as assert from "../assert";
export default function parse(values) {
    const rowList = values.get("TALENT.CSV");
    const result = new Map();
    for (const row of rowList ?? []) {
        const index = parseInt(row[0]);
        assert.number(index, "Index of talent in TALENT.CSV should be an integer");
        result.set(index, row[1] ?? "");
    }
    return result;
}