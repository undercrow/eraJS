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
	| {type: "begin"; keyword: string}
	| {type: "break"}
	| {type: "continue"}
	| {type: "return"; value: string | number | null};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default class Statement {
	public *run(_vm: VM): Generator<Output, Result | null, string | null> {
		return null;
	}
}