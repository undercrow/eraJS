import Value from "../../value";
import type VM from "../../vm";
import type Expr from "./index";
export default class Variable implements Expr {
    name: string;
    index: Expr[];
    scope?: string;
    constructor(name: string, index: Expr[], scope?: string);
    getCell(vm: VM): Value<any>;
    reduce(vm: VM): Promise<string | number>;
    reduceIndex(vm: VM): Promise<number[]>;
}
