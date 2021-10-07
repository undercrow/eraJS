import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Bar extends Statement {
    arg: Lazy<[Expr, Expr, Expr]>;
    newline: boolean;
    constructor(raw: string, newline?: boolean);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
