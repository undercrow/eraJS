import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class CsvRelation extends Statement {
    arg: Lazy<[Expr, Expr]>;
    constructor(arg: string);
    run(_vm: VM): Generator<never, null, unknown>;
}
