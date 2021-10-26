import Lazy from "../../lazy";
import { PrintFlag } from "../../output-queue";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class Print extends Statement {
    flags: Set<PrintFlag>;
    value: Lazy<string>;
    constructor(flags: PrintFlag[], raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
