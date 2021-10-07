import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";
export default class StrAssign extends Statement {
    dest: Variable;
    value: Expr[];
    constructor(dest: Variable, value: Expr[]);
    run(vm: VM): Generator<never, null, unknown>;
}
