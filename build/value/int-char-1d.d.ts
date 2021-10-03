import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class IntChar1DValue implements Value {
    type: "number";
    name: string;
    size: number;
    static normalizeIndex(vm: VM, index: number[]): number[];
    constructor(name: string, size: number);
    get(vm: VM, index: number[]): number;
    set(vm: VM, value: Leaf, index: number[]): void;
    rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]): void;
    length(depth: number): number;
}
