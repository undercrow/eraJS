import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class Sign extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const value = this.arg.get().reduce(vm);
        assert.number(value, "1st Argument of SIGN should be an integer");
        const result = Math.sign(value);
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
