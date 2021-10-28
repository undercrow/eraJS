import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintButton extends Statement {
    align?: "LEFT" | "RIGHT";
    arg: Lazy<[Expr, Expr]>;
    constructor(raw: Slice, align?: PrintButton["align"]);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
