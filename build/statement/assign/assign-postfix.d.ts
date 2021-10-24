import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Variable from "../expr/variable";
import Statement from "../index";
declare type Operator = "++" | "--";
export default class AssignPostfix extends Statement {
    dest: Variable;
    operator: Operator;
    arg: Lazy<undefined>;
    constructor(dest: Variable, operator: Operator, raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
export {};
