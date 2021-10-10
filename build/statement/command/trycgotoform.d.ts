import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class TryCGotoForm extends Statement {
    static parse(lines: string[], from: number): [TryCGotoForm, number];
    target: Form;
    catchThunk: Thunk;
    constructor(target: Form, catchThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string | null>;
}
