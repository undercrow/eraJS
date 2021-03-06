import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["palam"] {
	const rowList = values.get("PALAM.CSV");

	const result = Array<string>(100).fill("");
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of palam in PALAM.CSV should be an integer");
		result[index] = row[1] ?? "";
	}

	return result;
}
