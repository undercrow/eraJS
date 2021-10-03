import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintData extends Statement {
    static parse(postfix: string, lines: string[]): [PrintData, string[]];
    postfix: string;
    data: Expr[];
    constructor(postfix: string, data: Expr[]);
    run(vm: VM): Generator<import("../index").Output, null, string>;
}
