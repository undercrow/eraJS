import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class PrintC extends Statement {
    align: "LEFT" | "RIGHT";
    postfix: string;
    value: Lazy<string>;
    constructor(align: PrintC["align"], postfix: string, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string>;
}
