import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class SubstringU extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [valueExpr, startExpr, endExpr] = this.arg.get();
        const value = await valueExpr.reduce(vm);
        assert.string(value, "1st argument of SUBSTRINGU must be a string!");
        const start = await startExpr.reduce(vm);
        assert.bigint(start, "2nd argument of SUBSTRINGU must be a number!");
        const end = await endExpr.reduce(vm);
        assert.bigint(end, "3rd argument of SUBSTRINGU must be a number!");
        if (end < 0) {
            vm.getValue("RESULTS").set(vm, value.slice(Number(start)), [0]);
        }
        else {
            vm.getValue("RESULTS").set(vm, value.slice(Number(start), Number(end)), [0]);
        }
        return null;
    }
}
