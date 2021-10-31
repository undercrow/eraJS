import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";
export default class AssignStr extends Statement {
    dest: Variable;
    arg: Lazy<Expr[]>;
    constructor(dest: Variable, raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
