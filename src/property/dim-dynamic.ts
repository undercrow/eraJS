import NDArray from "../ndarray";

export default class DimDynamic {
	public name: string;
	public type: "number" | "string";
	public size: number[];
	public value?: number | string | number[] | string[];

	public constructor(
		name: DimDynamic["name"],
		type: DimDynamic["type"],
		size: DimDynamic["size"],
		value: DimDynamic["value"],
	) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.value = value;
	}

	public apply(variableMap: Map<string, NDArray>) {
		if (this.value == null) {
			variableMap.set(this.name, new NDArray(this.type, this.size));
		} else {
			variableMap.set(this.name, NDArray.fromValue(this.type, this.value));
		}
	}
}
