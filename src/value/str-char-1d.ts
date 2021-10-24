import * as assert from "../assert";
import * as E from "../error";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class StrChar1DValue implements Value<never> {
	public type = <const>"string";
	public name: string;
	public value!: never;
	public size: number;

	public static normalizeIndex(vm: VM, name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [vm.getValue("TARGET").get(vm, []) as number, 0];
		} else if (index.length === 1) {
			return [vm.getValue("TARGET").get(vm, []) as number, index[0]];
		} else if (index.length === 2) {
			return index;
		} else if (index.length === 3 && index[2] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("1D character", name, index);
		}
	}

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [100];
		assert.cond(realSize.length === 1, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.size = realSize[0];
	}

	public reset(): this {
		throw E.internal(`1D character variable ${this.name} cannot be reset`);
	}

	public get(vm: VM, index: number[]): string {
		const realIndex = StrChar1DValue.normalizeIndex(vm, this.name, index);
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		return cell.get(vm, realIndex.slice(1)) as string;
	}

	public set(vm: VM, value: Leaf, index: number[]) {
		const realIndex = StrChar1DValue.normalizeIndex(vm, this.name, index);
		assert.string(value, "Cannot assign a number to a string variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		cell.set(vm, value, realIndex.slice(1));
	}

	public rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]) {
		const realIndex = StrChar1DValue.normalizeIndex(vm, this.name, [...index, 0]);
		assert.string(value, "Cannot assign a number to a string variable");
		if (vm.characterList.length <= realIndex[0]) {
			throw E.notFound("Character", `#${realIndex[0]}`);
		}

		const cell = vm.characterList[realIndex[0]].getValue(this.name)!;
		cell.rangeSet(vm, value, realIndex.slice(1), range);
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return this.size;
			case 1: return this.size;
			case 2: return 1;
			// TODO: Use EraJSError
			default:
				throw new Error(`1D character variable doesn't have a value at depth ${depth}`);
		}
	}
}
