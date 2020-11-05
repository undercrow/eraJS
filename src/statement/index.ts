import type VM from "../vm";

export type Output =
	| {type: "string"; text: string}
	| {type: "button"; text: string; value: string}
	| {type: "line"; value?: string}
	| {type: "clearline"; count: number}
	| {type: "resetdata"}
	| {type: "loadgame"}
	| {type: "loadglobal"}
	| {type: "wait"}
	| {type: "input"};

export type Result =
	| {type: "begin"; keyword: string}
	| {type: "goto"; label: string}
	| {type: "break"}
	| {type: "continue"}
	| {type: "throw"; value: string}
	| {type: "return"; value: Array<number | string>};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default class Statement {
	public *run(_vm: VM, _label?: string): Generator<Output, Result | null, string> {
		return null;
	}
}
