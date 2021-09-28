import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["talent"] {
	const rowList = values.get("TALENT.CSV");

	const result: Data["talent"] = new Map();
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of talent in TALENT.CSV should be an integer");
		result.set(index, row[1] ?? "");
	}

	return result;
}
