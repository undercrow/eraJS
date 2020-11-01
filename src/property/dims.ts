import NDArray from "../ndarray";

export default class DimS {
	public name: string;
	public size: number[];
	public value?: string | string[];

	public constructor(name: DimS["name"], size: DimS["size"], value: DimS["value"]) {
		this.name = name;
		this.size = size;
		this.value = value;
	}

	public apply(variableMap: Map<string, NDArray>) {
		if (this.value == null) {
			variableMap.set(this.name, new NDArray("string", []));
		} else {
			variableMap.set(this.name, NDArray.fromValue("string", this.value));
		}
	}
}
