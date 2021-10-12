import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class GetBit extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [valueExpr, indexExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assert.number(value, "1st Argument of GETBIT should be an integer");
        const index = indexExpr.reduce(vm);
        assert.number(index, "2nd Argument of GETBIT should be an integer");
        // eslint-disable-next-line no-bitwise
        const result = (value & (1 << index)) !== 0 ? 1 : 0;
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
