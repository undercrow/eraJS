import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class Jump extends Statement {
    static exec(vm: VM, target: string, argExpr: Array<Expr | undefined>): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
    arg: Lazy<[string, Array<Expr | undefined>]>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
