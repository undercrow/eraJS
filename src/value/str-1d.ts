import {assertString} from "../assert";
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

	public static normalizeIndex(index: number[]): number[] {
		if (index.length === 0) {
			return [0];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[1] === 0) {
			return [];
		} else {
			throw new Error("1D variable must be indexed by at most 1 value");
		}
	}

	public constructor(size0: number) {
		this.value = new Array<string>(size0).fill("");
	}

	public get(_vm: VM, index: number[]): string {
		const realIndex = Str1DValue.normalizeIndex(index);
		return this.value[realIndex[0]];
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		const realIndex = Str1DValue.normalizeIndex(index);
		assertString(value, "Cannot assign a number to a string variable");

		this.value[realIndex[0]] = value;
	}

	public reset(_vm: VM, value: string[] | Map<number, string>) {
		for (let i = 0; i < this.value.length; ++i) {
			this.value[i] = "";
		}
		if (value instanceof Map) {
			for (const [i, val] of value) {
				this.value[i] = val;
			}
		} else {
			for (let i = 0; i < value.length; ++i) {
				this.value[i] = value[i];
			}
		}
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return this.value.length;
			case 1: return 1;
			default: throw new Error(`1D variable doesn't have a value at depth ${depth}`);
		}
	}
}
