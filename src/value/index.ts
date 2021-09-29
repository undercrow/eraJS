import {Data} from "../data";
import type VM from "../vm";
import Int0DValue from "./int-0d";
import Int1DValue from "./int-1d";
import IntChar0DValue from "./int-char-0d";
import IntChar1DValue from "./int-char-1d";
import RandValue from "./rand";
import Str0DValue from "./str-0d";
import Str1DValue from "./str-1d";
import StrChar0DValue from "./str-char-0d";
import StrChar1DValue from "./str-char-1d";

export type Leaf = number | string;

export default abstract class Value {
	public abstract type: "string" | "number";
	public abstract name: string;
	public abstract get(vm: VM, index: number[]): Leaf;
	public abstract set(vm: VM, value: Leaf, index: number[]): void;
	public abstract rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]): void;
	public abstract length(depth: number): number;

	public static Rand(_data: Data, name: string): RandValue {
		return new RandValue(name);
	}

	public static Int0D(_data: Data, name: string) {
		return new Int0DValue(name);
	}

	public static Str0D(_data: Data, name: string) {
		return new Str0DValue(name);
	}

	public static Int1D(data: Data, name: string, size: number = 1000) {
		return new Int1DValue(name, data.varSize.get(name) ?? size);
	}

	public static Str1D(data: Data, name: string, size: number = 100) {
		return new Str1DValue(name, data.varSize.get(name) ?? size);
	}

	public static IntChar0D(_data: Data, name: string) {
		return new IntChar0DValue(name);
	}

	public static StrChar0D(_data: Data, name: string) {
		return new StrChar0DValue(name);
	}

	public static IntChar1D(data: Data, name: string, size: number = 1000) {
		return new IntChar1DValue(name, data.varSize.get(name) ?? size);
	}

	public static StrChar1D(data: Data, name: string, size: number = 100) {
		return new StrChar1DValue(name, data.varSize.get(name) ?? size);
	}
}
