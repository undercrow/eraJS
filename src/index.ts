import type Config from "./config";
import parseCSV from "./data";
import type Fn from "./fn";
import parseERB from "./parser/erb";
import parseERH from "./parser/erh";
import type Property from "./property";
import Define from "./property/define";
import VM from "./vm";

export function compile(erh: string[], erb: string[], csv: Map<string, string>): VM {
	const data = parseCSV(csv);

	const macros = new Set<string>();
	let header: Property[] = [];
	for (const content of erh) {
		const parsed = parseERH(content, macros);
		for (const property of parsed) {
			if (property instanceof Define) {
				macros.add(property.name);
			}
		}
		header = header.concat(parsed);
	}

	let fnList: Fn[] = [];
	for (const content of erb) {
		fnList = fnList.concat(parseERB(content, macros));
	}

	return new VM({header, fnList, data});
}

export type {Config, VM};
