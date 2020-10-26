import type {Fn} from "./ast";
import rawCompile, {Program} from "./compiler";
import parse from "./parser";
import * as vm from "./vm";

export function compile(files: string[]): Program {
	const fnList = ([] as Fn[]).concat(...files.map(parse));
	return rawCompile(fnList);
}

export const exec = vm.exec;
