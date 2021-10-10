import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Int2DValue implements Value {
    type: "number";
    name: string;
    value: number[][];
    static normalizeIndex(index: number[]): number[];
    constructor(name: string, size0: number, size1: number);
    reset(value: number[][]): Int2DValue;
    get(_vm: VM, index: number[]): number;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]): void;
    length(depth: number): number;
}
