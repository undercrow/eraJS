import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import Call from "./call";
export default class TryCCall extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [TryCCall, number];
    arg: Call["arg"];
    thenThunk: Thunk;
    catchThunk: Thunk;
    constructor(raw: Slice, thenThunk: Thunk, catchThunk: Thunk);
    run(vm: VM, label?: string): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
