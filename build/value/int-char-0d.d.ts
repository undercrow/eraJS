import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class IntChar0DValue implements Value {
    type: "number";
    name: string;
    static normalizeIndex(vm: VM, name: string, index: number[]): number[];
    constructor(name: string);
    get(vm: VM, index: number[]): number;
    set(vm: VM, value: Leaf, index: number[]): void;
    rangeSet(vm: VM, value: Leaf, index: number[], _range: [number, number]): void;
    length(depth: number): number;
}
