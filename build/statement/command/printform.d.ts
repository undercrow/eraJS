import Lazy from "../../lazy";
import { PrintFlag } from "../../output-queue";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class PrintForm extends Statement {
    flags: Set<PrintFlag>;
    arg: Lazy<Form>;
    constructor(flags: PrintFlag[], raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
