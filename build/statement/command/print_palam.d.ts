import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintPalam extends Statement {
    arg: Lazy<Expr>;
    constructor(raw: Slice);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
