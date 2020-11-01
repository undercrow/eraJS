import {assert, assertNumber, assertString} from "./assert";

export type Leaf = string | number;
export type Value = Leaf | Leaf[] | Leaf[][];

export default class NDArray {
	public depth: 0 | 1 | 2;
	public type: "number" | "string";
	public value: Value;

	public static fromValue(type: NDArray["type"], value: Value): NDArray {
		let size: number[];
		if (Array.isArray(value)) {
			const depth1 = value[0];
			if (Array.isArray(depth1)) {
				size = [value.length, depth1.length];
			} else {
				size = [value.length];
			}
		} else {
			size = [];
		}

		const arr = new NDArray(type, size);
		switch (arr.depth) {
			case 0: {
				(arr.value as Leaf) = value as Leaf;
				break;
			}
			case 1: {
				for (let i = 0; i < (arr.value as Leaf[]).length; ++i) {
					(arr.value as Leaf[])[i] = (value as Leaf[])[i];
				}
				break;
			}
			default: {
				throw new Error(`NDArray.fromValue is not implemented for ${arr.depth}D array`);
			}
		}

		return arr;
	}

	public constructor(type: NDArray["type"], size: number[], initial?: Leaf) {
		let leaf: Leaf;
		if (initial != null) {
			if (type === "number") {
				assertNumber(initial, `${initial} is not an integer`);
			} else {
				assertString(initial, `${initial} is not a string`);
			}
			leaf = initial;
		} else {
			if (type === "number") {
				leaf = 0;
			} else {
				leaf = "";
			}
		}

		this.type = type;
		switch (size.length) {
			case 0: this.value = leaf; break;
			case 1: this.value = Array(size[0]).fill(leaf); break;
			default: throw new Error(`${size.length}D array is not supported`);
		}
		this.depth = size.length;
	}

	public get(...index: number[]): Leaf {
		switch (this.depth) {
			case 0: return this.value as Leaf;
			case 1: {
				assertNumber(index[0], "1st index for 1D array should be specified");
				return (this.value as Leaf[])[index[0]];
			}
			case 2: {
				assertNumber(index[0], "1st index for 2D array should be specified");
				assertNumber(index[1], "2nd index for 2D array should be specified");
				return (this.value as Leaf[][])[index[0]][index[1]];
			}
		}
	}

	public set(value: Leaf, ...index: number[]) {
		assert(typeof value === this.type, "Type mismatch");
		switch (this.depth) {
			case 0: this.value = value; break;
			case 1: {
				assertNumber(index[0], "1st index for 1D array should be specified");
				(this.value as Leaf[])[index[0]] = value;
				break;
			}
			case 2: {
				assertNumber(index[0], "1st index for 2D array should be specified");
				assertNumber(index[1], "2nd index for 2D array should be specified");
				(this.value as Leaf[][])[index[0]][index[1]] = value;
				break;
			}
		}
	}

	public length(depth: 0 | 1 | 2) {
		switch (depth) {
			case 0: {
				switch (this.depth) {
					case 0: return 1;
					case 1: return (this.value as Leaf[]).length;
					case 2: return (this.value as Leaf[][]).length;
				}
			}
			case 1: {
				switch (this.depth) {
					case 0: throw new Error("Cannot get 1st size of 0D array");
					case 1: return 1;
					case 2: return (this.value as Leaf[][])[0].length;
				}
			}
			case 2: {
				switch (this.depth) {
					case 0: throw new Error("Cannot get 1st size of 0D array");
					case 1: throw new Error("Cannot get 2nd size of 1D array");
					case 2: return 1;
				}
			}
		}
	}
}
