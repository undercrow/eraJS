import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(E.variable, E.expr, E.expr);
export default class InRange extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [valueExpr, minExpr, maxExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assertNumber(value, "1st Argument of INRANGE should be an integer");
        const min = minExpr.reduce(vm);
        assertNumber(min, "2nd Argument of INRANGE should be an integer");
        const max = maxExpr.reduce(vm);
        assertNumber(max, "3rd Argument of INRANGE should be an integer");
        const result = min <= value && value <= max ? 1 : 0;
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
