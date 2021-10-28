import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Bar extends Statement {
    arg: Lazy<[Expr, Expr, Expr]>;
    newline: boolean;
    constructor(raw: Slice, newline?: boolean);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
