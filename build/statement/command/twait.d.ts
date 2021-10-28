import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement, { EraGenerator } from "../index";
export default class TWait extends Statement {
    arg: Lazy<[Expr, Expr]>;
    constructor(raw: Slice);
    run(vm: VM): EraGenerator;
}
