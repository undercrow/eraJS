import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class TryCallForm extends Statement {
    static parse(raw: string): TryCallForm;
    target: Form;
    arg: (Expr | undefined)[];
    constructor(target: Form, arg: TryCallForm["arg"]);
    run(vm: VM): Generator<import("../index").Output, {
        type: "begin";
        keyword: string;
    } | {
        type: "goto";
        label: string;
    } | {
        type: "break";
    } | {
        type: "continue";
    } | {
        type: "throw";
        value: string;
    } | {
        type: "quit";
    } | null, string>;
}
