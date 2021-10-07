import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintButton extends Statement {
    align?: "LEFT" | "RIGHT";
    arg: Lazy<[Expr, Expr]>;
    constructor(arg: string, align?: PrintButton["align"]);
    run(vm: VM): Generator<{
        readonly type: "button";
        readonly text: string;
        readonly value: string;
        readonly cell: "LEFT" | "RIGHT" | undefined;
    }, null, unknown>;
}
