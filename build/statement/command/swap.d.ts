import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class Swap extends Statement {
    arg: Lazy<[Variable, Variable]>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
