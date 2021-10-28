import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
export default class CallFormF extends Statement {
    arg: Lazy<[Form, Array<Expr | undefined>]>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, {
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
    } | null, string | null>;
}
