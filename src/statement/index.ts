import type VM from "../vm";

export type Output =
	| {type: "string"; value: string}
	| {type: "line"}
	| {type: "clearline"; count: number}
	| {type: "resetdata"}
	| {type: "loadgame"}
	| {type: "loadglobal"}
	| {type: "wait"}
	| {type: "input"};

export type Result =
	| {type: "return"; value: string | number | null}
	| {type: "begin"; keyword: string};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default class Statement {
	public *run(_vm: VM): Generator<Output, Result | null, string | null> {
		return null;
	}
}
