import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";
declare type Operator = "+=";
export default class AssignOpStr extends Statement {
    dest: Variable;
    operator: Operator;
    arg: Lazy<Expr>;
    constructor(dest: Variable, operator: Operator, raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
export {};
