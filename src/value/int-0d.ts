import {assertNumber} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Int0DValue implements Value {
	public type = <const>"number";
	public value: number;

	public static from(value: number) {
		const result = new Int0DValue();
		result.value = value;

		return result;
	}

	public static normalizeIndex(index: number[]): number[] {
		if (index.length === 0) {
			return [];
		} else if (index.length === 1 && index[0] === 0) {
			return [];
		} else {
			throw new Error("0D variable must be indexed by at most 0 value");
		}
	}

	public constructor() {
		this.value = 0;
	}

	public get(_vm: VM, index: number[]): number {
		Int0DValue.normalizeIndex(index);
		return this.value;
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		Int0DValue.normalizeIndex(index);
		assertNumber(value, "Cannot assign a string to a numeric variable");

		this.value = value;
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return 1;
			default: throw new Error(`0D variable doesn't have a value at depth ${depth}`);
		}
	}
}
