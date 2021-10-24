import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class Jump extends Statement {
    static exec(vm: VM, target: string, argExpr: Array<Expr | undefined>): Generator<import("../index").Output, import("../index").Result | null, string>;
    arg: Lazy<[string, Array<Expr | undefined>]>;
    constructor(raw: Slice);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
