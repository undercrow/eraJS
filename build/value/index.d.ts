import type VM from "../vm";
export declare type Leaf = bigint | string;
export default interface _Value<T> {
    type: "string" | "number";
    name: string;
    value: T;
    reset: (value: T) => this;
    get: (vm: VM, index: number[]) => Leaf;
    set: (vm: VM, value: Leaf, index: number[]) => void;
    rangeSet: (vm: VM, value: Leaf, index: number[], range: [number, number]) => void;
    length: (depth: number) => number;
}
