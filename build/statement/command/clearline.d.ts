import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class ClearLine extends Statement {
    arg: Lazy<Expr>;
    constructor(arg: string);
    run(vm: VM): Generator<{
        readonly type: "clearline";
        readonly count: number;
    }, null, unknown>;
}
