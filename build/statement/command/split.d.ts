import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class Split extends Statement {
    arg: Lazy<[Expr, Expr, Variable]>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
