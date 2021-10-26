import type VM from "../vm";
export default class LocalSize {
    size: number;
    constructor(size: number);
    apply(vm: VM, fn: string): void;
}
