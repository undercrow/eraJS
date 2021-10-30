import Slice from "../slice";
import type {Leaf} from "../value";
import type VM from "../vm";

export type StringChunk = {
	type: "string";
	text: string;
	cell?: "LEFT" | "RIGHT";
	style: {
		color: string;
		font: string;
		bold: boolean;
		italic: boolean;
		strike: boolean;
		underline: boolean;
	};
};

export type ButtonChunk = {
	type: "button";
	text: string;
	value: string;
	cell?: "LEFT" | "RIGHT";
	style: {
		color: string;
		focus: string;
		font: string;
		bold: boolean;
		italic: boolean;
		strike: boolean;
		underline: boolean;
	};
};

export type Chunk = StringChunk | ButtonChunk;

export type ContentOutput = {
	type: "content";
	children: Chunk[];
	align: "LEFT" | "CENTER" | "RIGHT";
};

export type LineOutput = {
	type: "line";
	value?: string;
};

export type ClearOutput = {
	type: "clear";
	count: number;
};

export type WaitOutput = {
	type: "wait";
	force: boolean;
};

export type InputOutput = {
	type: "input";
	numeric: boolean;
	nullable: boolean;
};

export type TInputOutput = {
	type: "tinput";
	numeric: boolean;
	timeout: number;
	countdown: boolean;
};

export type Output =
	| ContentOutput
	| LineOutput
	| ClearOutput
	| WaitOutput
	| InputOutput
	| TInputOutput;

export type Result =
	| {type: "begin"; keyword: string}
	| {type: "goto"; label: string}
	| {type: "break"}
	| {type: "continue"}
	| {type: "throw"; value: string}
	| {type: "return"; value: Array<Leaf>}
	| {type: "quit"};

export type EraGenerator<T = Result | null> = AsyncGenerator<Output, T, string | null>;

export default class Statement {
	public raw: Slice;

	public constructor(raw: Slice) {
		this.raw = raw;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(_vm: VM, _label?: string): EraGenerator {
		return null;
	}
}
