import * as assert from "../assert";
import * as E from "../error";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Int1DValue implements Value<bigint[]> {
	public type = <const>"number";
	public name: string;
	public value: bigint[];

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [0];
		} else if (index.length === 1) {
			return index;
		} else if (index.length === 2 && index[1] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("1D", name, index);
		}
	}

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [1000];
		assert.cond(realSize.length === 1, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.value = new Array<bigint>(realSize[0]).fill(0n);
	}

	public reset(value: bigint[] | number[] | Map<number, number>): this {
		for (let i = 0; i < this.value.length; ++i) {
			this.value[i] = 0n;
		}
		if (value instanceof Map) {
			for (const [i, val] of value) {
				this.value[i] = BigInt(val);
			}
		} else {
			for (let i = 0; i < value.length; ++i) {
				this.value[i] = BigInt(value[i]);
			}
		}

		return this;
	}

	public get(_vm: VM, index: number[]): bigint {
		const realIndex = Int1DValue.normalizeIndex(this.name, index);
		return this.value[realIndex[0]];
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		const realIndex = Int1DValue.normalizeIndex(this.name, index);
		assert.bigint(value, "Cannot assign a string to a numeric variable");

		this.value[realIndex[0]] = value;
	}

	// NOTE: index is ignored (Emuera emulation)
	public rangeSet(_vm: VM, value: Leaf, _index: number[], range: [number, number]) {
		assert.bigint(value, "Cannot assign a string to a numeric variable");
		for (let i = range[0]; i < range[1]; ++i) {
			this.value[i] = value;
		}
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return this.value.length;
			case 1: return 1;
			default: throw new Error(`1D variable doesn't have a value at depth ${depth}`);
		}
	}
}
