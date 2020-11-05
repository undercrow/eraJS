import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["item"] {
	const rowList = values.get("ITEM.CSV");

	const result = Array<string>(1000).fill("");
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of ability in ABL.CSV should be an integer");
		result[index] = row[1] ?? "";
	}

	return result;
}
