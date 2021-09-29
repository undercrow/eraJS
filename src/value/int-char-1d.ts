import {assertNumber} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class IntChar1DValue implements Value {
	public type = <const>"number";
	public name: string;
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

	public constructor(name: string, size: number) {
		this.name = name;
		this.size = size;
	}

	public get(vm: VM, index: number[]): number {
		const realIndex = IntChar1DValue.normalizeIndex(vm, index);
		if (vm.characterList.length <= realIndex[0]) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		return cell.get(vm, realIndex.slice(1)) as number;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = IntChar1DValue.normalizeIndex(vm, index);
		assertNumber(value, "Cannot assign a string to a numeric variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		cell.set(vm, value, realIndex.slice(1));
	}

	public rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]) {
		const realIndex = IntChar1DValue.normalizeIndex(vm, [...index, 0]);
		assertNumber(value, "Cannot assign a string to a numeric variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		cell.rangeSet(vm, value, realIndex.slice(1), range);
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
