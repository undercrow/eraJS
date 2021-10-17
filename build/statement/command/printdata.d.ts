import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintData extends Statement {
    static parse(postfix: string, lines: Slice[], from: number): [PrintData, number];
    postfix: string;
    data: Lazy<Expr>[];
    constructor(raw: Slice, postfix: string, data: Lazy<Expr>[]);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
