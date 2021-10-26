import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Statement from "../index";
export default class CopyChara extends Statement {
    arg: Lazy<[Expr, Expr]>;
    constructor(raw: Slice);
    run(): Generator<never, null, unknown>;
}
