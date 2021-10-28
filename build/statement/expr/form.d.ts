import type VM from "../../vm";
import type Expr from "./index";
export default class Form implements Expr {
    expr: Array<{
        value: string | Expr;
        display?: Expr;
        align?: "LEFT" | "RIGHT";
    }>;
    constructor(expr: Form["expr"]);
    reduce(vm: VM): Promise<string>;
}
