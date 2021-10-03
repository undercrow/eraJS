import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class TryCJump extends Statement {
    static parse(lines: string[]): [TryCJump, string[]];
    target: string;
    arg: (Expr | undefined)[];
    catchExpr: Thunk;
    constructor(target: string, arg: TryCJump["arg"], catchExpr: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string>;
}
