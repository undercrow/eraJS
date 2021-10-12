import type VM from "../../vm";
import Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";
declare type Operator = "+=";
export default class OpAssign extends Statement {
    dest: Variable;
    operator: Operator;
    expr: Expr;
    constructor(dest: Variable, operator: Operator, expr: Expr);
    run(vm: VM): Generator<never, null, unknown>;
}
export {};
