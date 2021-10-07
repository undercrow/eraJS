import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(E.variable, E.expr, E.expr);
export default class Power extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [dest, baseExpr, exponentExpr] = this.arg.get();
        const destIndex = dest.reduceIndex(vm);
        const base = baseExpr.reduce(vm);
        assertNumber(base, "2nd Argument of POWER should be an integer");
        const exponent = exponentExpr.reduce(vm);
        assertNumber(exponent, "3rd Argument of GETBIT should be an integer");
        const result = base ** exponent;
        vm.getValue(dest.name, dest.scope).set(vm, result, destIndex);
        return null;
    }
}
