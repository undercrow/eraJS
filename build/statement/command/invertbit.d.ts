import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class InvertBit extends Statement {
    arg: Lazy<[Variable, ...Expr[]]>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
