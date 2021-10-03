import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(E.expr, E.expr, E.expr);
export default class BarStr extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [valueExpr, maxExpr, lengthExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assertNumber(value, "1st argument of BAR must be a number");
        const max = maxExpr.reduce(vm);
        assertNumber(max, "2nd argument of BAR must be a number");
        const length = lengthExpr.reduce(vm);
        assertNumber(length, "3rd argument of BAR must be a number");
        const filled = Math.floor(length * (value / max));
        const result = "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]";
        vm.getValue("RESULTS").set(vm, result, [0]);
        return null;
    }
}
