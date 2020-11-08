import {assert, assertNumber} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Int1DValue implements Value {
	public type = <const>"number";
	public value: number[];

	public static from(value: number[]) {
		const result = new Int1DValue(value.length);
		for (let i = 0; i < value.length; ++i) {
			result.value[i] = value[i];
		}

		return result;
	}

	public constructor(size0: number) {
		this.value = new Array<number>(size0).fill(0);
	}

	public get(_vm: VM, index: number[]): number {
		assert(index.length === 1 || index[1] === 0, "1D variable must be indexed by 1 value");

		return this.value[index[0]];
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		assert(index.length === 1 || index[1] === 0, "1D variable must be indexed by 1 value");
		assertNumber(value, "Cannot assign a string to a numeric variable");

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
