import * as assert from "../assert";
import * as EM from "../error";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Str0DValue implements Value {
	public type = <const>"string";
	public name: string;
	public value: string;

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [];
		} else if (index.length === 1 && index[0] === 0) {
			return [];
		} else {
			throw EM.invalidIndex("0D", name, index);
		}
	}

	public constructor(name: string) {
		this.name = name;
		this.value = "";
	}

	public reset(value: string): Str0DValue {
		this.value = value;
		return this;
	}

	public get(_vm: VM, index: number[]): string {
		Str0DValue.normalizeIndex(this.name, index);
		return this.value;
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		Str0DValue.normalizeIndex(this.name, index);
		assert.string(value, "Cannot assign a number to a string variable");

		this.value = value;
	}

	// NOTE: index is ignored (Emuera emulation)
	public rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]) {
		assert.string(value, "Cannot assign a number to a string variable");

		this.value = value;
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return 1;
			default: throw new Error(`0D variable doesn't have a value at depth ${depth}`);
		}
	}
}
