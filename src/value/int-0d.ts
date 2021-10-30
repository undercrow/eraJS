import * as assert from "../assert";
import * as E from "../error";
import type VM from "../vm";
import Value, {Leaf} from "./index";

export default class Int0DValue implements Value<bigint> {
	public type = <const>"number";
	public name: string;
	public value: bigint;

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [];
		} else if (index.length === 1 && index[0] === 0) {
			return [];
		} else {
			throw E.invalidIndex("0D", name, index);
		}
	}

	public constructor(name: string) {
		this.name = name;
		this.value = 0n;
	}

	public reset(value: bigint | number): this {
		this.value = BigInt(value);
		return this;
	}

	public get(_vm: VM, index: number[]): bigint {
		Int0DValue.normalizeIndex(this.name, index);
		return this.value;
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		Int0DValue.normalizeIndex(this.name, index);
		assert.bigint(value, "Cannot assign a string to a numeric variable");

		this.value = value;
	}

	// NOTE: index is ignored (Emuera emulation)
	public rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]) {
		assert.bigint(value, "Cannot assign a string to a numeric variable");

		this.value = value;
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return 1;
			default: throw new Error(`0D variable doesn't have a value at depth ${depth}`);
		}
	}
}
