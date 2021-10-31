import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.expr, X.expr);
export default class GetExpLv extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [valExpr, maxExpr] = this.arg.get();
        const value = await valExpr.reduce(vm);
        assert.bigint(value, "1st argument of GETEXPLV must be a number");
        const max = await maxExpr.reduce(vm);
        assert.bigint(max, "2nd argument of GETEXPLV must be a number");
        let result = max;
        for (let i = 0n; i <= max; ++i) {
            if (value < vm.getValue("EXPLV").get(vm, [Number(i)])) {
                result = i - 1n;
                break;
            }
        }
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
