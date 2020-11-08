import {assertString} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class StrChar1DValue implements Value {
	public type = <const>"string";
	public value: Map<number, string[]>;
	public size: number;

	public constructor(size: number) {
		this.value = new Map();
		this.size = size;
	}

	public get(vm: VM, index: number[]): string {
		let realIndex: number[];
		if (index.length === 2) {
			realIndex = index;
		} else if (index.length === 1) {
			realIndex = [vm.getValue("TARGET").get(vm, []) as number, index[0]];
		} else {
			throw new Error("1D character variable must be indexed by 1 or 2 value");
		}

		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		return this.value.get(realIndex[0])![realIndex[1]];
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		assertString(value, "Cannot assign a number to a string variable");
		let realIndex: number[];
		if (index.length === 2) {
			realIndex = index;
		} else if (index.length === 1) {
			realIndex = [vm.getValue("TARGET").get(vm, []) as number, index[0]];
		} else {
			throw new Error("1D character variable must be indexed by 1 or 2 value");
		}

		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		this.value.get(realIndex[0])![realIndex[1]] = value;
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
