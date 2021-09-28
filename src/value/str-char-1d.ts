import {assertString} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class StrChar1DValue implements Value {
	public type = <const>"string";
	public value: Map<number, string[]>;
	public size: number;

	public static normalizeIndex(vm: VM, index: number[]): number[] {
		if (index.length === 0) {
			return [vm.getValue("TARGET").get(vm, []) as number, 0];
		} else if (index.length === 1) {
			return [vm.getValue("TARGET").get(vm, []) as number, index[0]];
		} else if (index.length === 2) {
			return index;
		} else if (index.length === 3 && index[2] === 0) {
			return index.slice(0, -1);
		} else {
			throw new Error("1D character variable must be indexed by at most 2 values");
		}
	}

	public constructor(size: number) {
		this.value = new Map();
		this.size = size;
	}

	public get(vm: VM, index: number[]): string {
		const realIndex = StrChar1DValue.normalizeIndex(vm, index);
		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		return this.value.get(realIndex[0])![realIndex[1]];
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = StrChar1DValue.normalizeIndex(vm, index);
		assertString(value, "Cannot assign a number to a string variable");
		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		this.value.get(realIndex[0])![realIndex[1]] = value;
	}

	public reset(_vm: VM, index: number, value: string[] | Map<number, string>) {
		const result = Array<string>(this.size).fill("");
		if (value instanceof Map) {
			for (const [i, val] of value) {
				result[i] = val;
			}
		} else {
			for (let i = 0; i < value.length; ++i) {
				result[i] = value[i];
			}
		}
		this.value.set(index, result);
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return this.size;
			case 1: return this.size;
			case 2: return 1;
			default:
				throw new Error(`1D character variable doesn't have a value at depth ${depth}`);
		}
	}
}
