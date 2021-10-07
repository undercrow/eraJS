import Lazy from "../../lazy";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class SortChara extends Statement {
    value: Lazy<[Variable, "FORWARD" | "BACK" | undefined]>;
    constructor(raw: string);
    run(_vm: VM): Generator<never, null, unknown>;
}
