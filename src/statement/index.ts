import Slice from "../slice";
import type VM from "../vm";

export type Output =
	| {type: "newline"}
	| {type: "string"; text: string; cell?: "LEFT" | "RIGHT"}
	| {type: "button"; text: string; value: string; cell?: "LEFT" | "RIGHT"}
	| {type: "line"; value?: string}
	| {type: "clear"; count: number}
	| {type: "wait"; force: boolean}
	| {type: "input"; numeric: boolean}
	| {type: "input"; numeric: boolean; timeout: number; showClock: boolean};

export type Result =
	| {type: "begin"; keyword: string}
	| {type: "goto"; label: string}
	| {type: "break"}
	| {type: "continue"}
	| {type: "throw"; value: string}
	| {type: "return"; value: Array<number | string>}
	| {type: "quit"};

export type EraGenerator<T = Result | null> = Generator<Output, T, string | null>;

export default class Statement {
	public raw: Slice;

	public constructor(raw: Slice) {
		this.raw = raw;
	}

	public *run(_vm: VM, _label?: string): EraGenerator {
		return null;
	}
}
