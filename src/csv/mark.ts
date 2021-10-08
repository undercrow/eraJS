import * as assert from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["mark"] {
	const rowList = values.get("MARK.CSV");

	const result: Data["mark"] = new Map();
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assert.number(index, "Index of mark in MARK.CSV should be an integer");
		result.set(index, row[1] ?? "");
	}

	return result;
}
