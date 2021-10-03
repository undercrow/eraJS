import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Int1DValue implements Value {
    type: "number";
    name: string;
    value: number[];
    static normalizeIndex(index: number[]): number[];
    constructor(name: string, size0: number);
    reset(value: number[] | Map<number, number>): Int1DValue;
    get(_vm: VM, index: number[]): number;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], range: [number, number]): void;
    length(depth: number): number;
}
