import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class PrintV extends Statement {
    postfix: string;
    value: Lazy<Expr[]>;
    constructor(instruction: string, raw: string);
    run(vm: VM): Generator<import("../index").Output, null, string>;
}
