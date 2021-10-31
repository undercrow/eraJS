import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
export default class TryCGoto extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [TryCGoto, number];
    arg: Lazy<string>;
    catchThunk: Thunk;
    constructor(raw: Slice, catchThunk: Thunk);
    run(vm: VM, label?: string): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
