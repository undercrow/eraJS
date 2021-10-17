import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg3R3(E.expr, E.expr, E.variable);
export default class Split extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [valueExpr, sepExpr, destExpr] = this.arg.get();
        const value = valueExpr.reduce(vm);
        assert.string(value, "1st argument of SPLIT must be a string!");
        const sep = sepExpr.reduce(vm);
        assert.string(sep, "2nd argument of SPLIT must be a number!");
        const dest = destExpr.getCell(vm);
        const index = destExpr.reduceIndex(vm);
        const chunkList = value.split(sep);
        for (let i = 0; i < chunkList.length; ++i) {
            dest.set(vm, chunkList[i], [...index, i]);
        }
        vm.getValue("RESULT").set(vm, chunkList.length, [0]);
        return null;
    }
}
