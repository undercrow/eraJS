import {assert, assertString} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Str0DValue implements Value {
	public type = <const>"string";
	public value: string;

	public static from(value: string) {
		const result = new Str0DValue();
		result.value = value;

		return result;
	}

	public constructor() {
		this.value = "";
	}

	public get(_vm: VM, index: number[]): string {
		assert(index.length === 0 || index[0] === 0, "0D variable must be indexed by 0 value");

		return this.value;
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		assert(index.length === 0 || index[0] === 0, "0D variable must be indexed by 0 value");
		assertString(value, "Cannot assign a number to a string variable");

		this.value = value;
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return 1;
			default: throw new Error(`0D variable doesn't have a value at depth ${depth}`);
		}
	}
}
