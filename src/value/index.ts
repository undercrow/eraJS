import type VM from "../vm";
import Int0DValue from "./int-0d";
import Int1DValue from "./int-1d";
import Str0DValue from "./str-0d";
import Str1DValue from "./str-1d";

export type Leaf = number | string;

export default abstract class Value {
	public abstract type: "string" | "number";
	public abstract get(vm: VM, index: number[]): Leaf;
	public abstract set(vm: VM, value: Leaf, index: number[]): void;
	public abstract length(depth: number): number;

	public static from(value: Leaf | Leaf[]): Value {
		if (Array.isArray(value)) {
			if (typeof value[0] === "number") {
				return Int1DValue.from(value as number[]);
			} else if (typeof value[0] === "string") {
				return Str1DValue.from(value as string[]);
			}
		} else {
			if (typeof value === "number") {
				return Int0DValue.from(value);
			} else if (typeof value === "string") {
				return Str0DValue.from(value);
			}
		}
		throw new Error("Unexpected value found");
	}
}
