import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Str0DValue implements Value<string> {
    type: "string";
    name: string;
    value: string;
    static normalizeIndex(name: string, index: number[]): number[];
    constructor(name: string);
    reset(value: string): this;
    get(_vm: VM, index: number[]): string;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]): void;
    length(depth: number): number;
}
