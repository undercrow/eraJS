import {assert, assertNumber, assertString} from "./assert";

export type Leaf = string | number;
export type Value = Leaf | Leaf[] | Leaf[][];

function repeat<T>(length: number, valueFn: () => T): T[] {
	return Array(length).fill(null).map(valueFn);
}

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
			case 1: this.value = repeat(size[0], () => leaf); break;
			case 2: this.value = repeat(size[0], () => repeat(size[1], () => leaf)); break;
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

	public length(depth: number) {
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
		throw new Error(`Invalid array depth ${depth}`);
	}

	public removeAt(...index: number[]) {
		const leaf = this.type === "number" ? 0 : "";
		switch (index.length) {
			case 1: {
				switch (this.depth) {
					case 0: throw new Error("Cannot remove depth 1 value of 0D array");
					case 1: {
						(this.value as Leaf[]).splice(index[0]);
						(this.value as Leaf[]).push(leaf);
						return;
					}
					case 2: {
						(this.value as Leaf[][]).splice(index[0]);
						(this.value as Leaf[][]).push(repeat(this.length(1), () => leaf));
						return;
					}
				}
			}
			case 2: {
				switch (this.depth) {
					case 0: throw new Error("Cannot remove depth 2 value of 0D array");
					case 1: throw new Error("Cannot remove depth 2 value of 1D array");
					case 2: {
						(this.value as Leaf[][])[index[0]].splice(index[1]);
						(this.value as Leaf[][])[index[0]].push(leaf);
						return;
					}
				}
			}
		}
		throw new Error(`Invalid index size ${index.length}`);
	}
}
