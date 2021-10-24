import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.variable, C.Float);
export default class Times extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [dest, value] = this.arg.get();
        const original = dest.reduce(vm);
        assert.number(original, "1st argument of TIMES must be a number");
        const index = dest.reduceIndex(vm);
        dest.getCell(vm).set(vm, Math.floor(original * value), index);
        return null;
    }
}
