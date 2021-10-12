import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
export default class TryCGoto extends Statement {
    static parse(lines: string[], from: number): [TryCGoto, number];
    target: string;
    catchThunk: Thunk;
    constructor(target: string, catchThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
