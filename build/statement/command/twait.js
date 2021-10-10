import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class TWait extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [timeoutExpr, forceExpr] = this.arg.get();
        const timeout = timeoutExpr.reduce(vm);
        assert.number(timeout, "1st argument of TWAIT should be a number");
        const force = forceExpr.reduce(vm);
        assert.number(force, "2nd argument of TWAIT should be a number");
        yield {
            type: "wait",
            force: force !== 0,
        };
        return null;
    }
}
