import {Data} from "../data";
import type VM from "../vm";
import Int0DValue from "./int-0d";
import Int1DValue from "./int-1d";
import Int2DValue from "./int-2d";
import Int3DValue from "./int-3d";
import IntChar0DValue from "./int-char-0d";
import IntChar1DValue from "./int-char-1d";
import Str0DValue from "./str-0d";
import Str1DValue from "./str-1d";
import StrChar0DValue from "./str-char-0d";
import StrChar1DValue from "./str-char-1d";

export type Leaf = number | string;
export type SimpleValue =
	| Int0DValue
	| Int1DValue
	| Int2DValue
	| Int3DValue
	| Str0DValue
	| Str1DValue;
export default abstract class Value<T> {
	public abstract type: "string" | "number";
	public abstract name: string;
	public abstract value: T;
	public abstract reset(value: T): this;
	public abstract get(vm: VM, index: number[]): Leaf;
	public abstract set(vm: VM, value: Leaf, index: number[]): void;
	public abstract rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]): void;
	public abstract length(depth: number): number;

	public static Int0D(_data: Data, name: string) {
		return new Int0DValue(name);
	}

	public static Str0D(_data: Data, name: string) {
		return new Str0DValue(name);
	}

	public static Int1D(data: Data, name: string, size: number = 1000) {
		return new Int1DValue(name, data.varSize.get(name)?.[0] ?? size);
	}

	public static Str1D(data: Data, name: string, size: number = 100) {
		return new Str1DValue(name, data.varSize.get(name)?.[0] ?? size);
	}

	public static Int2D(data: Data, name: string, size0: number = 100, size1: number = 100) {
		return new Int2DValue(
			name,
			data.varSize.get(name)?.[0] ?? size0,
			data.varSize.get(name)?.[1] ?? size1,
		);
	}

	public static Int3D(
		_data: Data,
		name: string,
		size0: number = 100,
		size1: number = 100,
		size2: number = 100,
	) {
		// TODO: Get varsize from data
		return new Int3DValue(name, size0, size1, size2);
	}

	public static IntChar0D(_data: Data, name: string) {
		return new IntChar0DValue(name);
	}

	public static StrChar0D(_data: Data, name: string) {
		return new StrChar0DValue(name);
	}

	public static IntChar1D(data: Data, name: string, size: number = 1000) {
		return new IntChar1DValue(name, data.varSize.get(name)?.[0] ?? size);
	}

	public static StrChar1D(data: Data, name: string, size: number = 100) {
		return new StrChar1DValue(name, data.varSize.get(name)?.[0] ?? size);
	}
}
