import * as assert from "../assert";

type Item = {
	name: string;
	price: number;
};

export default function parse(fileName: string, rows: string[][]): Map<number, Item> {
	const result = new Map<number, Item>();
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
