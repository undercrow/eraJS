import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class SwapChara extends Statement {
    expr;
    constructor(raw) {
        super();
        this.expr = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [leftExpr, rightExpr] = this.expr.get();
        const left = leftExpr.reduce(vm);
        assert.number(left, "1st argument of SWAPCHARA must be a number");
        const right = rightExpr.reduce(vm);
        assert.number(right, "2nd argument of SWAPCHARA must be a number");
        const temp = vm.characterList[left];
        vm.characterList[left] = vm.characterList[right];
        vm.characterList[right] = temp;
        return null;
    }
}
