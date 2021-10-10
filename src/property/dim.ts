import * as assert from "../assert";
import type Expr from "../statement/expr";
import Value from "../value";
import Int1DValue from "../value/int-1d";
import Int2DValue from "../value/int-2d";
import Int3DValue from "../value/int-3d";
import Str1DValue from "../value/str-1d";
import type VM from "../vm";

export default class Dim {
	public name: string;
	public type: "number" | "string";
	public prefix: Set<string>;
	public size: Expr[];
	public value?: Expr[];

	public constructor(
		name: string,
		type: Dim["type"],
		prefix: string[],
		size: Expr[],
		value?: Expr[],
	) {
		this.name = name;
		this.type = type;
		this.size = size;
		this.prefix = new Set();
		this.value = value;

		for (const p of prefix) {
			this.prefix.add(p.toUpperCase());
		}
	}

	// TODO: CHARADATA
	public build(vm: VM): Value {
		if (this.value != null && this.value.length === 0 && this.type === "number") {
			const value = this.value[0].reduce(vm);
			assert.number(value, "Default value for 0D #DIM must be a number");
			return Value.Int0D(vm.code.data, this.name);
		} else if (this.value != null && this.value.length === 0 && this.type === "string") {
			const value = this.value[0].reduce(vm);
			assert.string(value, "Default value for 0D #DIMS must be a string");
			return Value.Str0D(vm.code.data, this.name).reset(value);
		} else if (this.value != null && this.value.length === 1 && this.type === "number") {
			const value = this.value.map((v) => v.reduce(vm));
			assert.numArray(value, "Default value for 1D #DIM must be a number array");
			return Value.Int1D(vm.code.data, this.name, value.length).reset(value);
		} else if (this.value != null && this.value.length === 1 && this.type === "string") {
			const value = this.value.map((v) => v.reduce(vm));
			assert.strArray(value, "Default value for 1D #DIMS must be a string array");
			return Value.Str1D(vm.code.data, this.name, value.length).reset(value);
		} else if (this.size.length === 0 && this.type === "number") {
			return Value.Int0D(vm.code.data, this.name);
		} else if (this.size.length === 0 && this.type === "string") {
			return Value.Str0D(vm.code.data, this.name);
		} else if (this.size.length === 1 && this.type === "number") {
			const size = this.size[0].reduce(vm);
			assert.number(size, "Size of an array must be an integer");
			return new Int1DValue(this.name, size);
		} else if (this.size.length === 1 && this.type === "string") {
			const size = this.size[0].reduce(vm);
			assert.number(size, "Size of an array must be an integer");
			return new Str1DValue(this.name, size);
		} else if (this.size.length === 2 && this.type === "number") {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			const size1 = this.size[1].reduce(vm);
			assert.number(size1, "Size of an array must be an integer");
			return new Int2DValue(this.name, size0, size1);
		} else if (this.size.length === 3 && this.type === "number") {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			const size1 = this.size[1].reduce(vm);
			assert.number(size1, "Size of an array must be an integer");
			const size2 = this.size[2].reduce(vm);
			assert.number(size2, "Size of an array must be an integer");
			return new Int3DValue(this.name, size0, size1, size2);
		} else {
			throw new Error("Invalid #DIM(S) definition found");
		}
	}
}
