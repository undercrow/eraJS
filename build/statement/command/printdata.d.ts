import Lazy from "../../lazy";
import { PrintFlag } from "../../output-queue";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintData extends Statement {
    static parse(flags: PrintFlag[], lines: Slice[], from: number): [PrintData, number];
    flags: Set<PrintFlag>;
    data: Lazy<Expr>[];
    constructor(raw: Slice, flags: PrintFlag[], data: Lazy<Expr>[]);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
