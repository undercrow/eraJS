import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class DelChara extends Statement {
    charaters: Lazy<Expr[]>;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
