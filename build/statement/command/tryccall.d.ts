import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class TryCCall extends Statement {
    static parse(lines: string[], from: number): [TryCCall, number];
    target: string;
    arg: (Expr | undefined)[];
    thenThunk: Thunk;
    catchThunk: Thunk;
    constructor(target: string, arg: TryCCall["arg"], thenThunk: Thunk, catchThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string>;
}
