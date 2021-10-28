import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR1(X.variable, X.expr);
export default class ClearBit extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [destExpr, ...bitExpr] = this.arg.get();
        const value = await destExpr.reduce(vm);
        assert.number(value, "1st argument of CLEARBIT must be a number");
        const bitList = [];
        for (let i = 0; i < bitExpr.length; ++i) {
            const bit = await bitExpr[i].reduce(vm);
            assert.number(bit, `${i + 1}th Argument of CLEARBIT must be a number`);
            bitList.push(bit);
        }
        let result = value;
        for (const bit of bitList) {
            // eslint-disable-next-line no-bitwise
            result &= ~(1 << bit);
        }
        destExpr.getCell(vm).set(vm, result, await destExpr.reduceIndex(vm));
        return null;
    }
}
