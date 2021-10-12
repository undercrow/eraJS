import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class SetColor extends Statement {
    value: Lazy<Expr | [Expr, Expr, Expr]>;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
