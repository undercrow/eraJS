import * as assert from "../assert";
import * as E from "../error";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class StrChar0DValue implements Value<never> {
	public type = <const>"string";
	public name: string;
	public value!: never;

	public static normalizeIndex(vm: VM, name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [vm.getValue("TARGET").get(vm, []) as number];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[0] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("0D character", name, index);
		}
	}

	public constructor(name: string) {
		this.name = name;
	}

	public reset(): this {
		throw E.internal(`0D character variable ${this.name} cannot be reset`);
	}

	public get(vm: VM, index: number[]): string {
		const realIndex = StrChar0DValue.normalizeIndex(vm, this.name, index);
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		return cell.get(vm, realIndex.slice(1)) as string;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = StrChar0DValue.normalizeIndex(vm, this.name, index);
		assert.string(value, "Cannot assign a number to a string variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
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
