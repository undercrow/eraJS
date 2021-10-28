import type VM from "../../vm";
import type Expr from "./index";
declare type Operator = "+" | "-" | "!" | "~";
export default class Unary implements Expr {
    expr: Expr;
    op: Operator;
    constructor(op: Operator, expr: Expr);
    reduce(vm: VM): Promise<number>;
}
export {};
