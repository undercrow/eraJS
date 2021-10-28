import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import CallForm from "./callform";
export default class TryCCallForm extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [TryCCallForm, number];
    arg: CallForm["arg"];
    thenThunk: Thunk;
    catchThunk: Thunk;
    constructor(raw: Slice, thenThunk: Thunk, catchThunk: Thunk);
    run(vm: VM, label?: string): AsyncGenerator<import("../index").Output, import("../index").Result | null, string | null>;
}
