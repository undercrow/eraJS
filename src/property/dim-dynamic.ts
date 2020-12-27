import {assertNumber, assertString} from "../assert";
import type Expr from "../statement/expr";
import Int0DValue from "../value/int-0d";
import Int1DValue from "../value/int-1d";
import Str0DValue from "../value/str-0d";
import Str1DValue from "../value/str-1d";
import type VM from "../vm";

export default class DimDynamic {
	public name: string;
	public type: "number" | "string";
	public size: Expr[];
	public value?: Expr[];

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
		if (this.value != null && this.value.length === 0 && this.type === "number") {
			const value = this.value[0].reduce(vm);
			assertNumber(value, "Default value for #DIM must be a number");
			context.dynamicMap.set(this.name, Int0DValue.from(value));
		} else if (this.value != null && this.value.length === 0 && this.type === "string") {
			const value = this.value[0].reduce(vm);
			assertString(value, "Default value for #DIMS must be a string");
			context.dynamicMap.set(this.name, Str0DValue.from(value));
		} else if (this.value != null && this.value.length === 1 && this.type === "number") {
			const value = this.value.map((v) => v.reduce(vm));
			value.forEach((v) => assertNumber(v, "Default value for #DIM must be a number"));
			context.dynamicMap.set(this.name, Int1DValue.from(value as number[]));
		} else if (this.value != null && this.value.length === 1 && this.type === "string") {
			const value = this.value.map((v) => v.reduce(vm));
			value.forEach((v) => assertString(v, "Default value for #DIMS must be a string"));
			context.dynamicMap.set(this.name, Str1DValue.from(value as string[]));
		} else if (this.size.length === 0 && this.type === "number") {
			context.dynamicMap.set(this.name, new Int0DValue());
		} else if (this.size.length === 0 && this.type === "string") {
			context.dynamicMap.set(this.name, new Str0DValue());
		} else if (this.size.length === 1 && this.type === "number") {
			const size = this.size[0].reduce(vm);
			assertNumber(size, "Size of an array must be an integer");
			context.dynamicMap.set(this.name, new Int1DValue(size));
		} else if (this.size.length === 1 && this.type === "string") {
			const size = this.size[0].reduce(vm);
			assertNumber(size, "Size of an array must be an integer");
			context.dynamicMap.set(this.name, new Str1DValue(size));
		}
	}
}
