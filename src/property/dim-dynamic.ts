import Value from "../value";
import Int0DValue from "../value/int-0d";
import Int1DValue from "../value/int-1d";
import Str0DValue from "../value/str-0d";
import Str1DValue from "../value/str-1d";
import type VM from "../vm";

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

	public apply(vm: VM) {
		const context = vm.context();
		if (this.value != null) {
			context.dynamicMap.set(this.name, Value.from(this.value));
		} else if (this.size.length === 0 && this.type === "number") {
			context.dynamicMap.set(this.name, new Int0DValue());
		} else if (this.size.length === 0 && this.type === "string") {
			context.dynamicMap.set(this.name, new Str0DValue());
		} else if (this.size.length === 1 && this.type === "number") {
			context.dynamicMap.set(this.name, new Int1DValue(this.size[0]));
		} else if (this.size.length === 1 && this.type === "string") {
			context.dynamicMap.set(this.name, new Str1DValue(this.size[0]));
		}
	}
}
