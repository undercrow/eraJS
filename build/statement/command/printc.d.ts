import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class PrintC extends Statement {
    align: "LEFT" | "RIGHT";
    postfix: string;
    value: Lazy<string>;
    constructor(align: PrintC["align"], postfix: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
