import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintPlain extends Statement {
    value: Lazy<Expr>;
    constructor(postfix: "FORM" | null, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
