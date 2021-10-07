import type VM from "../vm";
export default class DimRef {
    name: string;
    constructor(name: DimRef["name"]);
    apply(vm: VM): void;
}
