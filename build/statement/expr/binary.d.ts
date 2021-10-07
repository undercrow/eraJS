import type VM from "../../vm";
import type Expr from "./index";
declare type Operator = "*" | "/" | "%" | "+" | "-" | "<<" | ">>" | "<" | "<=" | ">" | ">=" | "==" | "!=" | "&" | "|" | "^" | "&&" | "!&" | "||" | "!|" | "^^";
export default class Binary implements Expr {
    left: Expr;
    right: Expr;
    op: Operator;
    constructor(op: Operator, left: Expr, right: Expr);
    reduce(vm: VM): string | number;
}
export {};
