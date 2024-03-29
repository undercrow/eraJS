import * as assert from "../assert";
import * as E from "../error";
import type VM from "../vm";
import type {default as Value, Leaf} from "./index";

export default class Int3DValue implements Value<bigint[][][]> {
	public type = <const>"number";
	public name: string;
	public value: bigint[][][];

	public static normalizeIndex(name: string, index: number[]): number[] {
		if (index.length === 0) {
			return [0, 0, 0];
		} else if (index.length === 1) {
			return [index[0], 0, 0];
		} else if (index.length === 2) {
			return [index[0], index[1], 0];
		} else if (index.length === 3) {
			return index;
		} else if (index.length === 4 && index[3] === 0) {
			return index.slice(0, -1);
		} else {
			throw E.invalidIndex("3D", name, index);
		}
	}

	public constructor(name: string, size?: number[]) {
		const realSize = size ?? [100, 100, 100];
		assert.cond(realSize.length === 3, `${name} is not a ${realSize.length}D variable`);

		this.name = name;
		this.value = new Array(realSize[0]).fill(0).map(
			() => new Array(realSize[1]).fill(0).map(
				() => new Array<bigint>(realSize[2]).fill(0n),
			),
		);
	}

	public reset(value: bigint[][][] | number[][][]): this {
		for (let i = 0; i < this.value.length; ++i) {
			for (let j = 0; j < this.value[i].length; ++j) {
				for (let k = 0; k < this.value[i][j].length; ++k) {
					this.value[i][j][k] = 0n;
				}
			}
		}

		for (let i = 0; i < value.length; ++i) {
			for (let j = 0; j < value[i].length; ++j) {
				for (let k = 0; k < value[i][j].length; ++k) {
					this.value[i][j][k] = BigInt(value[i][j][k]);
				}
			}
		}

		return this;
	}

	public get(_vm: VM, index: number[]): bigint {
		const realIndex = Int3DValue.normalizeIndex(this.name, index);
		return this.value[realIndex[0]][realIndex[1]][realIndex[2]];
	}

	public set(_vm: VM, value: Leaf, index: number[]) {
		const realIndex = Int3DValue.normalizeIndex(this.name, index);
		assert.bigint(value, "Cannot assign a string to a numeric variable");

		this.value[realIndex[0]][realIndex[1]][realIndex[2]] = BigInt(value);
	}

	// NOTE: index, range are ignored (Emuera emulation)
	public rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]) {
		assert.bigint(value, "Cannot assign a string to a numeric variable");
		for (let i = 0; i < this.value.length; ++i) {
			for (let j = 0; j < this.value[i].length; ++j) {
				for (let k = 0; k < this.value[i][j].length; ++k) {
					this.value[i][j][k] = value;
				}
			}
		}
	}

	public length(depth: number): number {
		switch (depth) {
			case 0: return this.value.length;
			case 1: return this.value[0].length;
			case 2: return this.value[0][0].length;
			case 3: return 1;
			default: throw new Error(`3D variable doesn't have a value at depth ${depth}`);
		}
	}
}
