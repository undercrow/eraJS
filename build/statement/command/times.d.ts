import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";
export default class Times extends Statement {
    arg: Lazy<[Variable, number]>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
