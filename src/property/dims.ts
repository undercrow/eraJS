import {assert} from "../assert";
import type {Value} from "../vm";

export default class DimS {
	public name: string;
	public size: number[];
	public value?: string | string[];

	public constructor(name: DimS["name"], size: DimS["size"], value: DimS["value"]) {
		this.name = name;
		this.size = size;
		this.value = value;
	}

	public apply(variableMap: Map<string, Value>) {
		switch (this.size.length) {
			case 0: {
				if (this.value == null) {
					variableMap.set(this.name, "");
				} else if (typeof this.value === "string") {
					variableMap.set(this.name, this.value);
				} else if (typeof this.value[0] === "string") {
					variableMap.set(this.name, this.value.slice());
				} else {
					throw new Error("Custom 2,3D array should define the size");
				}
				break;
			}
			case 1: {
				if (this.value == null) {
					variableMap.set(this.name, Array<string>(this.size[0]).fill(""));
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
