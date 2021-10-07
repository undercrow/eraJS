import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class TryJumpForm extends Statement {
    static parse(raw: string): TryJumpForm;
    target: Form;
    arg: (Expr | undefined)[];
    constructor(target: Form, arg: TryJumpForm["arg"]);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
