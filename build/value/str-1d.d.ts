import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Str1DValue implements Value {
    type: "string";
    name: string;
    value: string[];
    static normalizeIndex(index: number[]): number[];
    constructor(name: string, size0: number);
    reset(value: string[] | Map<number, string>): Str1DValue;
    get(_vm: VM, index: number[]): string;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], range: [number, number]): void;
    length(depth: number): number;
}
