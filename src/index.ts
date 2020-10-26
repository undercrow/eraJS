import type {Fn} from "./ast";
import rawCompile, {Config, Program, State} from "./compiler";
import parse from "./parser";

export function compile(files: string[], config: Config): [Program, State] {
	const fnList = ([] as Fn[]).concat(...files.map(parse));
	return rawCompile(fnList, config);
}

export type {Config, Program, State} from "./compiler";
export {exec} from "./vm";
