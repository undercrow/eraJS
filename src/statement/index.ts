import type VM from "../vm";

export type Output =
	| {type: "newline"}
	| {type: "string"; text: string; cell?: "LEFT" | "RIGHT"}
	| {type: "button"; text: string; value: string; cell?: "LEFT" | "RIGHT"}
	| {type: "line"; value?: string}
	| {type: "clearline"; count: number}
	| {type: "loadgame"}
	| {type: "wait"; force: boolean}
	| {type: "input"; numeric: boolean}
	| {type: "input"; numeric: boolean; timeout: number; showClock: boolean}
	// TODO: remove this output
	| {type: "redraw", value: number};

export type Result =
	| {type: "begin"; keyword: string}
	| {type: "goto"; label: string}
	| {type: "break"}
	| {type: "continue"}
	| {type: "throw"; value: string}
	| {type: "return"; value: Array<number | string>}
	| {type: "quit"};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default class Statement {
	public *run(_vm: VM, _label?: string): Generator<Output, Result | null, string | null> {
		return null;
	}
}
