import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR1(E.variable, E.expr);
export default class ClearBit extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [destExpr, ...bitExpr] = this.arg.get();
        const value = destExpr.reduce(vm);
        assert.number(value, "1st argument of CLEARBIT must be a number");
        const bitList = bitExpr.map((bit) => bit.reduce(vm));
        bitList.forEach((bit) => assert.number(bit, "Argument of CLEARBIT must be a number"));
        let result = value;
        for (const bit of bitList) {
            // eslint-disable-next-line no-bitwise
            result &= ~(1 << bit);
        }
        destExpr.getCell(vm).set(vm, result, destExpr.reduceIndex(vm));
        return null;
    }
}
