import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintPalam extends Statement {
    arg: Lazy<Expr>;
    constructor(arg: string);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
