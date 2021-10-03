import Lazy from "../../lazy";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Repeat extends Statement {
    static parse(arg: string, lines: string[]): [Repeat, string[]];
    condition: Lazy<Expr>;
    thunk: Thunk;
    constructor(arg: string, thunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string>;
}
