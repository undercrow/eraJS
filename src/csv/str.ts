import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["str"] {
	const rowList = values.get("STR.CSV");

	const result = Array<string>(20000).fill("");
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of palam in STR.CSV should be an integer");
		result[index] = row[1] ?? "";
	}

	return result;
}
