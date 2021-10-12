import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Throw extends Statement {
    arg: Lazy<Expr>;
    constructor(arg: string);
    run(vm: VM): Generator<never, {
        readonly type: "throw";
        readonly value: string;
    }, unknown>;
}
