import * as assert from "../assert";
export default function parse(values) {
    const rowList = values.get("ITEM.CSV");
    const result = new Map();
    for (const row of rowList ?? []) {
        const index = parseInt(row[0]);
        assert.number(index, "Index of item in ITEM.CSV should be an integer");
        result.set(index, {
            name: row[1] ?? "",
            price: Number(row[2] ?? "0"),
        });
    }
    return result;
}
