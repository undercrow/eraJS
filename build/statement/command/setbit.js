import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR1(E.variable, E.expr);
export default class SetBit extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [destExpr, ...bitExpr] = this.arg.get();
        const dest = destExpr.getCell(vm);
        const value = destExpr.reduce(vm);
        assertNumber(value, "1st argument of SETBIT must be a number");
        const bitList = bitExpr.map((bit) => bit.reduce(vm));
        bitList.forEach((bit) => assertNumber(bit, "Argument of SETBIT must be a number"));
        let result = value;
        for (const bit of bitList) {
            // eslint-disable-next-line no-bitwise
            result |= 1 << bit;
        }
        dest.set(vm, result, destExpr.reduceIndex(vm));
        return null;
    }
}
