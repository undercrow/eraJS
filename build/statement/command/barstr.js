import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class BarStr extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [valueExpr, maxExpr, lengthExpr] = this.arg.get();
        const value = await valueExpr.reduce(vm);
        assert.bigint(value, "1st argument of BAR must be a number");
        const max = await maxExpr.reduce(vm);
        assert.bigint(max, "2nd argument of BAR must be a number");
        const length = await lengthExpr.reduce(vm);
        assert.bigint(length, "3rd argument of BAR must be a number");
        const filled = length * value / max;
        const result = "[" + "*".repeat(Number(filled)) + ".".repeat(Number(length - filled)) + "]";
        vm.getValue("RESULTS").set(vm, result, [0]);
        return null;
    }
}
