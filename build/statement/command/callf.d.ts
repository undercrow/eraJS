import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class CallF extends Statement {
    static parse(raw: string): CallF;
    target: string;
    arg: (Expr | undefined)[];
    constructor(target: string, arg: CallF["arg"]);
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
