import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintFormS extends Statement {
    postfix: string;
    arg: Lazy<Expr>;
    constructor(instruction: string, raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
