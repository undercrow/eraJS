import {assertNumber} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class IntChar0DValue implements Value {
	public type = <const>"number";
	public value: Map<number, number>;

	public static normalizeIndex(vm: VM, index: number[]): number[] {
		if (index.length === 0) {
			return [vm.getValue("TARGET").get(vm, []) as number];
		} else if (index.length === 1) {
			return index;
		} else {
			throw new Error("0D character variable must be indexed by at most 1 value");
		}
	}

	public constructor() {
		this.value = new Map();
	}

	public get(vm: VM, index: number[]): number {
		const realIndex = IntChar0DValue.normalizeIndex(vm, index);
		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		return this.value.get(realIndex[0])!;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = IntChar0DValue.normalizeIndex(vm, index);
		assertNumber(value, "Cannot assign a string to a numeric variable");
		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		this.value.set(realIndex[0], value);
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return 1;
			case 1: return 1;
			default:
				throw new Error(`1D character variable doesn't have a value at depth ${depth}`);
		}
	}
}
