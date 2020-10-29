import parseCSV from "./config";
import type Fn from "./fn";
import parseERB from "./parser";
import VM from "./vm";

export function compile(erb: string[], csv: Map<string, string>): VM {
	const config = parseCSV(csv);
	const fnList = ([] as Fn[]).concat(...erb.map(parseERB));
	return new VM(fnList, config);
}
