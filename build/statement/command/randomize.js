import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class AddChara extends Statement {
    expr;
    constructor(raw) {
        super();
        this.expr = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const expr = this.expr.get();
        const seed = expr.reduce(vm);
        assert.number(seed, "1st argument of RANDOMIZE must be a number");
        vm.random.state = seed;
        return null;
    }
}
