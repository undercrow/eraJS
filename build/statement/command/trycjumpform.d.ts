import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import CallForm from "./callform";
export default class TryCJumpForm extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [TryCJumpForm, number];
    arg: CallForm["arg"];
    catchThunk: Thunk;
    constructor(raw: Slice, catchThunk: Thunk);
    run(vm: VM, label?: string): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
