import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Statement from "../index";
export default class AddCopyChara extends Statement {
    arg: Lazy<Expr>;
    constructor(raw: Slice);
    run(): Generator<never, null, unknown>;
}
