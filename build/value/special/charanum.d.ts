import type VM from "../../vm";
import type { default as Value, Leaf } from "../index";
export default class CharaNumValue implements Value<never> {
    type: "number";
    name: "CHARANUM";
    value: never;
    constructor();
    reset(): this;
    get(vm: VM, index: number[]): number;
    set(_vm: VM, _value: Leaf, _index: number[]): void;
    rangeSet(_vm: VM, _value: Leaf, _index: number[], _range: [number, number]): void;
    length(depth: number): number;
}
