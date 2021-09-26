import {assertNumber} from "../assert";
import type {Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["item"] {
	const rowList = values.get("ITEM.CSV");

	const result = Array<Data["item"][number]>(1000).fill({name: "", price: 0});
	for (const row of rowList ?? []) {
		const index = parseInt(row[0]);
		assertNumber(index, "Index of item in ITEM.CSV should be an integer");

		result[index] = {
			name: row[1] ?? "",
			price: Number(row[2] ?? "0"),
		};
	}

	return result;
}
