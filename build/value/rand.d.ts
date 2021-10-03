import type VM from "../vm";
import type { default as Value, Leaf } from "./index";
export default class RandValue implements Value {
    type: "number";
    name: string;
    constructor(name: string);
    get(vm: VM, index: number[]): number;
    set(_vm: VM, _value: Leaf, _index: number[]): void;
    rangeSet(_vm: VM, _value: Leaf, _index: number[], _range: [number, number]): void;
    length(_depth: number): number;
}
