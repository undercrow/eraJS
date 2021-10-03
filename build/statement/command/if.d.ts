import Lazy from "../../lazy";
import Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class If extends Statement {
    static parse(lines: string[]): [If, string[]];
    ifThunk: Array<[Lazy<Expr>, Thunk]>;
    elseThunk: Thunk;
    constructor(ifThunk: Array<[string, Thunk]>, elseThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string>;
}
