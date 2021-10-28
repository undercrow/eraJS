import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.expr, X.expr);
export default class TWait extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [timeoutExpr, forceExpr] = this.arg.get();
        const timeout = await timeoutExpr.reduce(vm);
        assert.number(timeout, "1st argument of TWAIT should be a number");
        const force = await forceExpr.reduce(vm);
        assert.number(force, "2nd argument of TWAIT should be a number");
        yield* vm.queue.wait(force !== 0);
        return null;
    }
}
