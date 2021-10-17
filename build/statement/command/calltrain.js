import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class CallTrain extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.arg.get().reduce(vm);
        assert.number(value, "Argument of CALLTRAIN must be a number");
        // vm.getValue("CTRAIN_COUNT").set(vm, value, []);
        return null;
    }
}
