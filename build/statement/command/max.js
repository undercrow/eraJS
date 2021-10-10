import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR1(E.expr, E.expr);
export default class Max extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const arg = this.arg.get().map((a) => a.reduce(vm));
        for (let i = 0; i < arg.length; ++i) {
            assert.number(arg[i], `${i + 1}th argument of MAX must be an integer`);
        }
        const result = Math.max(...arg);
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
