import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class SwapChara extends Statement {
    expr: Lazy<[Expr, Expr]>;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
