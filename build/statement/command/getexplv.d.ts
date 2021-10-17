import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class GetExpLv extends Statement {
    arg: Lazy<[Expr, Expr]>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
