import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg3R3(E.expr, E.expr, E.expr);
export default class Bar extends Statement {
    arg;
    newline;
    constructor(raw, newline = false) {
        super();
        this.arg = new Lazy(raw, PARSER);
        this.newline = newline;
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const [valueExpr, maxExpr, lengthExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assertNumber(value, "1st argument of BAR must be a number");
        const max = maxExpr.reduce(vm);
        assertNumber(max, "2nd argument of BAR must be a number");
        const length = lengthExpr.reduce(vm);
        assertNumber(length, "3rd argument of BAR must be a number");
        const filled = Math.floor(length * (value / max));
        yield* Print.print(vm, "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]");
        if (this.newline) {
            yield* Print.print(vm, "\n");
        }
        return null;
    }
}
