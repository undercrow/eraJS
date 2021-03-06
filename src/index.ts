import type Config from "./config";
import parseCSV from "./data";
import parseERB from "./erb/erb";
import parseERH from "./erb/erh";
import type Fn from "./fn";
import type Property from "./property";
import VM from "./vm";

export function compile(erh: string[], erb: string[], csv: Map<string, string>): VM {
	const data = parseCSV(csv);
	const header = ([] as Property[]).concat(...erh.map(parseERH));
	const fnList = ([] as Fn[]).concat(...erb.map(parseERB));
	return new VM({header, fnList, data});
}

export type {Config, VM};
