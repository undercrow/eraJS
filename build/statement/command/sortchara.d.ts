import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Variable from "../expr/variable";
import Statement from "../index";
export default class SortChara extends Statement {
    arg: Lazy<[Variable | undefined, "FORWARD" | "BACK" | undefined]>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
