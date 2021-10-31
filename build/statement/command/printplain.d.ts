import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintPlain extends Statement {
    arg: Lazy<Expr>;
    constructor(postfix: "FORM" | null, raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
