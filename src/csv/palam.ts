import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["palam"] {
	const rowList = values.get("PALAM.CSV");

	const result: Data["palam"] = new Map();
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of palam in PALAM.CSV should be an integer");
		result.set(index, row[1] ?? "");
	}

	return result;
}
