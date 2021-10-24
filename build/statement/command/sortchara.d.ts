import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class SortChara extends Statement {
    arg: Lazy<[Variable | undefined, "FORWARD" | "BACK" | undefined]>;
    constructor(raw: Slice);
    run(_vm: VM): Generator<never, null, unknown>;
}
