import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import Jump from "./jump";
export default class TryCJump extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [TryCJump, number];
    arg: Jump["arg"];
    catchExpr: Thunk;
    constructor(raw: Slice, catchExpr: Thunk);
    run(vm: VM, label?: string): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
