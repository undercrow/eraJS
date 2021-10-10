import Lazy from "../../lazy";
import type Expr from "../expr";
import Statement from "../index";
export default class PickupChara extends Statement {
    expr: Lazy<Expr[]>;
    constructor(raw: string);
    run(): Generator<never, null, unknown>;
}
