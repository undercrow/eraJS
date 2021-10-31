import * as assert from "../assert";
export default function parse(fileName, rows) {
    const result = new Map();
    for (const row of rows) {
        const index = parseInt(row[0]);
        assert.number(index, `Index value in ${fileName} should be an integer`);
        result.set(index, {
            name: row[1] ?? "",
            price: Number(row[2] ?? "0"),
        });
    }
    return result;
}
