import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class StrFindU extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [valueExpr, searchExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assert.string(value, "1st argument of STRFINDU must be a string!");
        const search = searchExpr.reduce(vm);
        assert.string(search, "2nd argument of STRFINDU must be a string!");
        // TODO: unicode
        vm.getValue("RESULT").set(vm, value.indexOf(search), [0]);
        return null;
    }
}
