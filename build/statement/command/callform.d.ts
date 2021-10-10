import P from "parsimmon";
import * as E from "../../erb/expr";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class CallForm extends Statement {
    static PARSER(exclude: keyof (typeof E.form)): P.Parser<[Form, (Expr | undefined)[]]>;
    arg: Lazy<[Form, Array<Expr | undefined>]>;
    constructor(raw: string);
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