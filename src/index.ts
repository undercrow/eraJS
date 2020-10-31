import parseCSV from "./config";
import parseERB from "./erb";
import type Fn from "./fn";
import VM from "./vm";

export function compile(erb: string[], csv: Map<string, string>): VM {
	const config = parseCSV(csv);
	const fnList = ([] as Fn[]).concat(...erb.map(parseERB));
	return new VM(fnList, config);
}
