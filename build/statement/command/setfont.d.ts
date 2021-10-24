import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class SetFont extends Statement {
    arg: Lazy<Expr | undefined>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
