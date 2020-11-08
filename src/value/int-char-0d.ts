import {assertNumber} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class IntChar0DValue implements Value {
	public type = <const>"number";
	public value: Map<number, number>;

	public constructor() {
		this.value = new Map();
	}

	public get(vm: VM, index: number[]): number {
		let realIndex: number[];
		if (index.length === 1) {
			realIndex = index;
		} else if (index.length === 0) {
			realIndex = [vm.getValue("TARGET").get(vm, []) as number];
		} else {
			throw new Error("0D character variable must be indexed by 0 or 1 value");
		}

		if (!this.value.has(realIndex[0])) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		return this.value.get(realIndex[0])!;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		assertNumber(value, "Cannot assign a string to a numeric variable");
		let realIndex: number[];
		if (index.length === 1) {
			realIndex = index;
		} else if (index.length === 0) {
			realIndex = [vm.getValue("TARGET").get(vm, []) as number];
		} else {
			throw new Error("0D character variable must be indexed by 0 or 1 value");
		}

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
