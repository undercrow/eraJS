import type Fn from "./fn";
import parse from "./parser";
import VM, {Config} from "./vm";

export function compile(files: string[], config: Config): VM {
	const fnList = ([] as Fn[]).concat(...files.map(parse));
	return new VM(fnList, config);
}

export type {Config} from "./vm";
