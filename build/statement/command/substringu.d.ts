import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class SubstringU extends Statement {
    arg: Lazy<[Expr, Expr, Expr]>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}