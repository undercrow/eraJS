import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Form from "../expr/form";
import Statement from "../index";
export default class TryCJumpForm extends Statement {
    static parse(lines: string[]): [TryCJumpForm, string[]];
    target: Form;
    arg: (Expr | undefined)[];
    catchThunk: Thunk;
    constructor(target: Form, arg: TryCJumpForm["arg"], catchThunk: Thunk);
    run(vm: VM, label?: string): Generator<import("../index").Output, import("../index").Result | null, string>;
}
