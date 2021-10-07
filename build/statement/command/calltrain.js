import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class CallTrain extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const value = this.arg.get().reduce(vm);
        assertNumber(value, "Argument of CALLTRAIN must be a number");
        // vm.getValue("CTRAIN_COUNT").set(vm, value, []);
        return null;
    }
}
