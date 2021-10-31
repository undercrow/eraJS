import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class Int2DValue implements Value<bigint[][]> {
    type: "number";
    name: string;
    value: bigint[][];
    static normalizeIndex(name: string, index: number[]): number[];
    constructor(name: string, size?: number[]);
    reset(value: bigint[][] | number[][]): this;
    get(_vm: VM, index: number[]): bigint;
    set(_vm: VM, value: Leaf, index: number[]): void;
    rangeSet(_vm: VM, value: Leaf, _index: number[], _range: [number, number]): void;
    length(depth: number): number;
}
