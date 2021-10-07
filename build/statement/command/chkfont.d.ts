import Lazy from "../../lazy";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
export default class ChkFont extends Statement {
    arg: Lazy<Expr>;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
