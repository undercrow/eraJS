import {assertString} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class StrChar0DValue implements Value {
	public type = <const>"string";
	public value: Map<number, string>;

	public static normalizeIndex(vm: VM, index: number[]): number[] {
		if (index.length === 0) {
			return [vm.getValue("TARGET").get(vm, []) as number];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[0] === 0) {
			return index.slice(0, -1);
		} else {
			throw new Error("0D character variable must be indexed by at most 1 value");
		}
	}

	public constructor() {
		this.value = new Map();
	}

	public get(vm: VM, index: number[]): string {
		const realIndex = StrChar0DValue.normalizeIndex(vm, index);
		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		return this.value.get(realIndex[0])!;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = StrChar0DValue.normalizeIndex(vm, index);
		assertString(value, "Cannot assign a number to a string variable");
		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		this.value.set(realIndex[0], value);
	}

	public rangeSet(vm: VM, value: Leaf, index: number[], _range: [number, number]) {
		const realIndex = StrChar0DValue.normalizeIndex(vm, index);
		assertString(value, "Cannot assign a number to a string variable");
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
