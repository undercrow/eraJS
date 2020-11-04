import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["mark"] {
	const rowList = values.get("MARK.CSV");

	const result = Array<string>(100).fill("");
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of mark in MARK.CSV should be an integer");
		result[index] = row[1] ?? "";
	}

	return result;
}
