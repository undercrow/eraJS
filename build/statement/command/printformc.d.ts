import Lazy from "../../lazy";
import { PrintFlag } from "../../printer";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintFormC extends Statement {
    align: "LEFT" | "RIGHT";
    flags: Set<PrintFlag>;
    arg: Lazy<Form>;
    constructor(align: PrintFormC["align"], flags: PrintFlag[], raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
