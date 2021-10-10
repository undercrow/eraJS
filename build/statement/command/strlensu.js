import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class StrLenSU extends Statement {
    value;
    constructor(arg) {
        super();
        this.value = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const value = this.value.get().reduce(vm);
        assert.string(value, "Argument of STRLENU must be a string!");
        vm.getValue("RESULT").set(vm, value.length, [0]);
        return null;
    }
}
