import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class Redraw extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.arg.get().reduce(vm);
        assert.number(value, "Argument of REDRAW must be a number");
        vm.draw = value !== 0;
        return null;
    }
}
