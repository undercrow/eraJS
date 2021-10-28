import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class BarStr extends Statement {
    arg: Lazy<[Expr, Expr, Expr]>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
