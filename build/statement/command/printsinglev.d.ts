import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintSingleV extends Statement {
    postfix: string;
    arg: Lazy<Expr[]>;
    constructor(postfix: string, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
