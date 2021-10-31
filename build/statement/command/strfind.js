import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.expr, X.expr);
export default class StrFind extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [valueExpr, searchExpr] = this.arg.get();
        const value = await valueExpr.reduce(vm);
        assert.string(value, "1st argument of STRFIND must be a string!");
        const search = await searchExpr.reduce(vm);
        assert.string(search, "2nd argument of STRFIND must be a string!");
        vm.getValue("RESULT").set(vm, BigInt(value.indexOf(search)), [0]);
        return null;
    }
}
