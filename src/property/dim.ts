import {assert} from "../assert";
import type {Value} from "../vm";

export default class Dim {
	public name: string;
	public size: number[];
	public value?: number | number[];

	public constructor(name: Dim["name"], size: Dim["size"], value: Dim["value"]) {
		this.name = name;
		this.size = size;
		this.value = value;
	}

	public apply(variableMap: Map<string, Value>) {
		switch (this.size.length) {
			case 0: {
				if (this.value == null) {
					variableMap.set(this.name, 0);
				} else if (typeof this.value === "number") {
					variableMap.set(this.name, this.value);
				} else if (typeof this.value[0] === "number") {
					variableMap.set(this.name, this.value.slice());
				} else {
					throw new Error("Custom 2,3D array should define the size");
				}
				break;
			}
			case 1: {
				if (this.value == null) {
					variableMap.set(this.name, Array<number>(this.size[0]).fill(0));
				} else {
					assert(
						Array.isArray(this.value),
						"Custom 1D array should have an array as an initial value",
					);
					variableMap.set(this.name, this.value.slice());
				}
				break;
			}
			case 2: {
				throw new Error("Custom 2D array is not implemented yet");
			}
			case 3: {
				throw new Error("Custom 3D array is not implemented yet");
			}
			default: {
				throw new Error(`${this.size.length}D array is not supported`);
			}
		}
	}
}
