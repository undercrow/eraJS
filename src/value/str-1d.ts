import {assert, assertString} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Str1DValue implements Value {
	public type = <const>"string";
	public value: string[];

	public static from(value: string[]) {
		const result = new Str1DValue(value.length);
		for (let i = 0; i < value.length; ++i) {
			result.value[i] = value[i];
		}

		return result;
	}

	public constructor(size0: number) {
		this.value = new Array<string>(size0).fill("");
	}

	public get(_vm: VM, index: number[]): string {
		assert(index.length === 1 || index[1] === 0, "1D variable must be indexed by 1 value");

		return this.value[index[0]];
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		assert(index.length === 1 || index[1] === 0, "1D variable must be indexed by 1 value");
		assertString(value, "Cannot assign a number to a string variable");

		this.value[index[0]] = value;
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return this.value.length;
			case 1: return 1;
			default: throw new Error(`1D variable doesn't have a value at depth ${depth}`);
		}
	}
}
