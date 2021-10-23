import * as assert from "../assert";
import * as EM from "../error";
import type Expr from "../statement/expr";
import Value from "../value";
import Int0DValue from "../value/int-0d";
import Int1DValue from "../value/int-1d";
import Int2DValue from "../value/int-2d";
import Int3DValue from "../value/int-3d";
import IntChar0DValue from "../value/int-char-0d";
import IntChar1DValue from "../value/int-char-1d";
import Str0DValue from "../value/str-0d";
import Str1DValue from "../value/str-1d";
import StrChar0DValue from "../value/str-char-0d";
import StrChar1DValue from "../value/str-char-1d";
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

	public isDynamic(): boolean {
		return this.prefix.has("DYNAMIC");
	}

	public isGlobal(): boolean {
		return this.prefix.has("GLOBAL");
	}

	public isSave(): boolean {
		return this.prefix.has("SAVEDATA");
	}

	public isChar(): boolean {
		return this.prefix.has("CHARADATA");
	}

	public build(vm: VM): Value<any> {
		if (this.value != null && this.value.length === 0 && this.type === "number") {
			const value = this.value[0].reduce(vm);
			assert.number(value, "Default value for 0D #DIM must be a number");
			return new Int0DValue(this.name).reset(value);
		} else if (this.value != null && this.value.length === 0 && this.type === "string") {
			const value = this.value[0].reduce(vm);
			assert.string(value, "Default value for 0D #DIMS must be a string");
			return new Str0DValue(this.name).reset(value);
		} else if (this.value != null && this.value.length === 1 && this.type === "number") {
			const value = this.value.map((v) => v.reduce(vm));
			assert.numArray(value, "Default value for 1D #DIM must be a number array");
			return new Int1DValue(this.name, value.length).reset(value);
		} else if (this.value != null && this.value.length === 1 && this.type === "string") {
			const value = this.value.map((v) => v.reduce(vm));
			assert.strArray(value, "Default value for 1D #DIMS must be a string array");
			return new Str1DValue(this.name, value.length).reset(value);
		} else if (this.size.length === 0 && this.type === "number" && !this.isChar()) {
			return new Int0DValue(this.name);
		} else if (this.size.length === 0 && this.type === "string" && !this.isChar()) {
			return new Str0DValue(this.name);
		} else if (this.size.length === 1 && this.type === "number" && !this.isChar()) {
			const size = this.size[0].reduce(vm);
			assert.number(size, "Size of an array must be an integer");
			return new Int1DValue(this.name, size);
		} else if (this.size.length === 1 && this.type === "string" && !this.isChar()) {
			const size = this.size[0].reduce(vm);
			assert.number(size, "Size of an array must be an integer");
			return new Str1DValue(this.name, size);
		} else if (this.size.length === 2 && this.type === "number" && !this.isChar()) {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			const size1 = this.size[1].reduce(vm);
			assert.number(size1, "Size of an array must be an integer");
			return new Int2DValue(this.name, size0, size1);
		} else if (this.size.length === 3 && this.type === "number" && !this.isChar()) {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			const size1 = this.size[1].reduce(vm);
			assert.number(size1, "Size of an array must be an integer");
			const size2 = this.size[2].reduce(vm);
			assert.number(size2, "Size of an array must be an integer");
			return new Int3DValue(this.name, size0, size1, size2);
		} else if (this.size.length === 0 && this.type === "number" && this.isChar()) {
			return new IntChar0DValue(this.name);
		} else if (this.size.length === 1 && this.type === "number" && this.isChar()) {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			return new IntChar1DValue(this.name, size0);
		} else if (this.size.length === 0 && this.type === "string" && this.isChar()) {
			return new StrChar0DValue(this.name);
		} else if (this.size.length === 1 && this.type === "string" && this.isChar()) {
			const size0 = this.size[0].reduce(vm);
			assert.number(size0, "Size of an array must be an integer");
			return new StrChar1DValue(this.name, size0);
		} else {
			throw EM.parser("Invalid #DIM(S) definition found");
		}
	}
}
