import type VM from "../vm";

export type Leaf = number | string;

export default abstract class Value {
	public abstract type: "string" | "number";
	public abstract get(vm: VM, index: number[]): Leaf;
	public abstract set(vm: VM, value: Leaf, index: number[]): void;
	public abstract rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]): void;
	public abstract length(depth: number): number;
}
