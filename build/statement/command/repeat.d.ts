import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Repeat extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [Repeat, number];
    arg: Lazy<Expr>;
    thunk: Thunk;
    constructor(raw: Slice, thunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
