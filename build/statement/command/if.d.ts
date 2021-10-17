import Lazy from "../../lazy";
import Slice from "../../slice";
import Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class If extends Statement {
    static parse(lines: Slice[], from: number): [If, number];
    ifThunk: Array<[Slice, Lazy<Expr>, Thunk]>;
    elseThunk: Thunk;
    constructor(ifThunk: Array<[Slice, Thunk]>, elseThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
