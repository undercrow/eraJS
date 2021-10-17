import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class PrintSingle extends Statement {
    postfix: string;
    arg: Lazy<string>;
    constructor(postfix: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
