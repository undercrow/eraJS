import * as E from "../../erb/expr";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class CallForm extends Statement {
    static parse(raw: string): CallForm;
    static compileArg(arg: string, exclude: keyof (typeof E.form)): [Form, Expr[]];
    target: Form;
    arg: (Expr | undefined)[];
    constructor(target: Form, arg: CallForm["arg"]);
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
