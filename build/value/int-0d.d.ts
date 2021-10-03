import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Int0DValue implements Value {
    type: "number";
    name: string;
    value: number;
    static normalizeIndex(index: number[]): number[];
    constructor(name: string);
    reset(value: number): Int0DValue;
    get(_vm: VM, index: number[]): number;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]): void;
    length(depth: number): number;
}
