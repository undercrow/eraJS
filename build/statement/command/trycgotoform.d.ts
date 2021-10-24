import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class TryCGotoForm extends Statement {
    static parse(arg: Slice, lines: Slice[], from: number): [TryCGotoForm, number];
    arg: Lazy<Form>;
    catchThunk: Thunk;
    constructor(raw: Slice, catchThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
