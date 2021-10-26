import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.variable, X.variable);
export default class Swap extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [leftExpr, rightExpr] = this.arg.get();
        const left = leftExpr.getCell(vm);
        const leftIndex = leftExpr.reduceIndex(vm);
        const right = rightExpr.getCell(vm);
        const rightIndex = rightExpr.reduceIndex(vm);
        const leftValue = left.get(vm, leftIndex);
        const rightValue = right.get(vm, rightIndex);
        left.set(vm, rightValue, leftIndex);
        right.set(vm, leftValue, rightIndex);
        return null;
    }
}
