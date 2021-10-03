import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class JumpForm extends Statement {
    static parse(raw: string): JumpForm;
    target: Form;
    arg: (Expr | undefined)[];
    constructor(target: Form, arg: JumpForm["arg"]);
    run(vm: VM): Generator<import("../index").Output, import("../index").Result | null, string>;
}
