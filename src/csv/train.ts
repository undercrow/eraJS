import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["train"] {
	const rowList = values.get("TRAIN.CSV");

	const result: Data["train"] = new Map();
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of train in TRAIN.CSV should be an integer");
		result.set(index, row[1] ?? "");
	}

	return result;
}
