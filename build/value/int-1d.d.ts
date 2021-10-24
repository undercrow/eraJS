import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Int1DValue implements Value<number[]> {
    type: "number";
    name: string;
    value: number[];
    static normalizeIndex(name: string, index: number[]): number[];
    constructor(name: string, size0: number);
    reset(value: number[] | Map<number, number>): this;
    get(_vm: VM, index: number[]): number;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], range: [number, number]): void;
    length(depth: number): number;
}
