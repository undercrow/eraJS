import * as assert from "../assert";
import type Expr from "../statement/expr";
import Value from "../value";
import Int1DValue from "../value/int-1d";
import Int2DValue from "../value/int-2d";
import Int3DValue from "../value/int-3d";
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
			assert.number(value, "Default value for #DIM must be a number");
			context.dynamicMap.set(this.name, Value.Int0D(vm.code.data, this.name).reset(value));
		} else if (this.value != null && this.value.length === 0 && this.type === "string") {
			const value = this.value[0].reduce(vm);
			assert.string(value, "Default value for #DIMS must be a string");
			context.dynamicMap.set(this.name, Value.Str0D(vm.code.data, this.name).reset(value));
		} else if (this.value != null && this.value.length === 1 && this.type === "number") {
			const value = this.value.map((v) => v.reduce(vm));
			value.forEach((v) => assert.number(v, "Default value for #DIM must be a number"));
			context.dynamicMap.set(
				this.name,
				Value.Int1D(vm.code.data, this.name, value.length).reset(value as number[]),
			);
		} else if (this.value != null && this.value.length === 1 && this.type === "string") {
			const value = this.value.map((v) => v.reduce(vm));
			value.forEach((v) => assert.string(v, "Default value for #DIMS must be a string"));
			context.dynamicMap.set(
				this.name,
				Value.Str1D(vm.code.data, this.name, value.length).reset(value as string[]),
			);
		} else if (this.size.length === 0 && this.type === "number") {
			context.dynamicMap.set(this.name, Value.Int0D(vm.code.data, this.name));
		} else if (this.size.length === 0 && this.type === "string") {
			context.dynamicMap.set(this.name, Value.Str0D(vm.code.data, this.name));
		} else if (this.size.length === 1 && this.type === "number") {
			const size = this.size[0].reduce(vm);
			assert.number(size, "Size of an array must be an integer");
			context.dynamicMap.set(this.name, new Int1DValue(this.name, size));
		} else if (this.size.length === 1 && this.type === "string") {
			const size = this.size[0].reduce(vm);
			assert.number(size, "Size of an array must be an integer");
			context.dynamicMap.set(this.name, new Str1DValue(this.name, size));
		} else if (this.size.length === 2 && this.type === "number") {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			const size1 = this.size[1].reduce(vm);
			assert.number(size1, "Size of an array must be an integer");
			context.dynamicMap.set(this.name, new Int2DValue(this.name, size0, size1));
		} else if (this.size.length === 3 && this.type === "number") {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			const size1 = this.size[1].reduce(vm);
			assert.number(size1, "Size of an array must be an integer");
			const size2 = this.size[2].reduce(vm);
			assert.number(size2, "Size of an array must be an integer");
			context.dynamicMap.set(this.name, new Int3DValue(this.name, size0, size1, size2));
		}
	}
}
