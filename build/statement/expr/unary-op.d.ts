import type VM from "../../vm";
import type Expr from "./index";
import type Variable from "./variable";
declare type Operator = "++" | "--";
export default class UnaryOp implements Expr {
    target: Variable;
    op: Operator;
    postfix: boolean;
    constructor(target: Variable, op: Operator, postfix: boolean);
    reduce(vm: VM): number;
}
export {};
