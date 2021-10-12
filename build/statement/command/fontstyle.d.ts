import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class FontStyle extends Statement {
    value: Lazy<Expr>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
