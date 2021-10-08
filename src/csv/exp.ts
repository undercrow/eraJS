import * as assert from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["exp"] {
	const rowList = values.get("EXP.CSV");

	const result: Data["exp"] = new Map();
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assert.number(index, "Index of exp in EXP.CSV should be an integer");
		result.set(index, row[1] ?? "");
	}

	return result;
}
