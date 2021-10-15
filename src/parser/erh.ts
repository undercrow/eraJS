import Property from "../property";
import prop from "./property";
import {normalize, preprocess, toLines} from "./preprocess";
import * as U from "./util";

export default function parseERH(files: Map<string, string>, macros: Set<string>): Property[] {
	const result: Property[] = [];

	for (const [name, content] of files) {
		const normalized = normalize(content);
		const lines = preprocess(toLines(normalized), macros);
		for (const line of lines) {
			line.file = name;
		}

		for (const line of lines) {
			result.push(U.tryParse(prop, line));
		}
	}

	return result;
}
