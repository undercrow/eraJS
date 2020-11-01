import {assertNumber} from "../assert";
import type {Config} from "../config";

export default function parse(values: Map<string, string[][]>): Config["ability"] {
	const rowList = values.get("ABL.CSV");

	const result = Array<string>(100).fill("");
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of ability in ABL.CSV should be an integer");
		result[index] = row[1] ?? "";
	}

	return result;
}
