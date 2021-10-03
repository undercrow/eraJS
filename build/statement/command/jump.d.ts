import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class Jump extends Statement {
    static parse(raw: string): Jump;
    target: string;
    arg: (Expr | undefined)[];
    constructor(target: string, arg: Jump["arg"]);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
