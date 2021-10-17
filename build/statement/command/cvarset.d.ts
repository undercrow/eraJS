import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class VarSet extends Statement {
    arg: Lazy<[
        Variable,
        Expr | undefined,
        Expr | undefined,
        Expr | undefined,
        Expr | undefined
    ]>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
