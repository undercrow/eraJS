import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class InvertBit extends Statement {
    arg: Lazy<[Variable, ...Expr[]]>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
