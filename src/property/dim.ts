import NDArray from "../ndarray";

export default class Dim {
	public name: string;
	public size: number[];
	public value?: number | number[];

	public constructor(name: Dim["name"], size: Dim["size"], value: Dim["value"]) {
		this.name = name;
		this.size = size;
		this.value = value;
	}

	public apply(variableMap: Map<string, NDArray>) {
		if (this.value == null) {
			variableMap.set(this.name, new NDArray("number", []));
		} else {
			variableMap.set(this.name, NDArray.fromValue("number", this.value));
		}
	}
}
