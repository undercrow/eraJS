import type VM from "../../vm";
import type Expr from "./index";
export default class Ternary implements Expr {
    condition: Expr;
    left: Expr;
    right: Expr;
    constructor(condition: Expr, left: Expr, right: Expr);
    reduce(vm: VM): Promise<string | number>;
}
