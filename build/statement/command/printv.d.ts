import Lazy from "../../lazy";
import { PrintFlag } from "../../printer";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintV extends Statement {
    flags: Set<PrintFlag>;
    value: Lazy<Expr[]>;
    constructor(flags: PrintFlag[], raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
