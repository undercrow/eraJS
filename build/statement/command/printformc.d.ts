import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintFormC extends Statement {
    align: "LEFT" | "RIGHT";
    postfix: string;
    arg: Lazy<Form>;
    constructor(align: PrintFormC["align"], postfix: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
