import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Redraw extends Statement {
    arg: Lazy<Expr>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
