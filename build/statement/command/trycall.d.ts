import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class TryCall extends Statement {
    static parse(raw: string): TryCall;
    target: string;
    arg: (Expr | undefined)[];
    constructor(target: string, arg: TryCall["arg"]);
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
