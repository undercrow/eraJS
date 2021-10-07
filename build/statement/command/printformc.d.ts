import Lazy from "../../lazy";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintFormC extends Statement {
    align: "LEFT" | "RIGHT";
    postfix: string;
    value: Lazy<Form>;
    constructor(align: PrintFormC["align"], postfix: string, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
