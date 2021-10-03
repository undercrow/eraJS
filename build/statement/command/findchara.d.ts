import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class FindChara extends Statement {
    arg: Lazy<[Variable, Expr, Expr | undefined, Expr | undefined]>;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
