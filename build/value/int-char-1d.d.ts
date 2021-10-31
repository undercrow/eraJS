import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class IntChar1DValue implements Value<never> {
    type: "number";
    name: string;
    value: never;
    size: number;
    static normalizeIndex(vm: VM, name: string, index: number[]): number[];
    constructor(name: string, size?: number[]);
    reset(): this;
    get(vm: VM, index: number[]): bigint;
    set(vm: VM, value: Leaf, index: number[]): void;
    rangeSet(vm: VM, value: Leaf, index: number[], range: [number, number]): void;
    length(depth: number): number;
}
