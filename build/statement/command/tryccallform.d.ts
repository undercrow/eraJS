import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Form from "../expr/form";
import Statement from "../index";
export default class TryCCallForm extends Statement {
    static parse(lines: string[], from: number): [TryCCallForm, number];
    target: Form;
    arg: (Expr | undefined)[];
    thenThunk: Thunk;
    catchThunk: Thunk;
    constructor(target: Form, arg: TryCCallForm["arg"], thenThunk: Thunk, catchThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string>;
}
