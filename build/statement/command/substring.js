import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class Substring extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [valueExpr, startExpr, endExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assert.string(value, "1st argument of SUBSTRING must be a string!");
        const start = startExpr.reduce(vm);
        assert.number(start, "2nd argument of SUBSTRING must be a number!");
        const end = endExpr.reduce(vm);
        assert.number(end, "3rd argument of SUBSTRING must be a number!");
        if (end < 0) {
            vm.getValue("RESULTS").set(vm, value.slice(start), [0]);
        }
        else {
            vm.getValue("RESULTS").set(vm, value.slice(start, end), [0]);
        }
        return null;
    }
}
