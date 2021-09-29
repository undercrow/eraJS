import {assertNumber} from "../assert";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class IntChar0DValue implements Value {
	public type = <const>"number";
	public name: string;

	public static normalizeIndex(vm: VM, index: number[]): number[] {
		if (index.length === 0) {
			return [vm.getValue("TARGET").get(vm, []) as number];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[1] === 0) {
			return index.slice(0, -1);
		} else {
			throw new Error("0D character variable must be indexed by at most 1 value");
		}
	}

	public constructor(name: string) {
		this.name = name;
	}

	public get(vm: VM, index: number[]): number {
		const realIndex = IntChar0DValue.normalizeIndex(vm, index);
		if (vm.characterList.length <= realIndex[0]) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		return cell.get(vm, realIndex.slice(1)) as number;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = IntChar0DValue.normalizeIndex(vm, index);
		assertNumber(value, "Cannot assign a string to a numeric variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw new Error(`Character #${realIndex[0]} does not exist`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		cell.set(vm, value, realIndex.slice(1));
	}

	public rangeSet(vm: VM, value: Leaf, index: number[], _range: [number, number]) {
		this.set(vm, value, index);
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
