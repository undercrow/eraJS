import type VM from "../vm";
export default class LocalSSize {
    size: number;
    constructor(size: number);
    apply(vm: VM, fn: string): void;
}
