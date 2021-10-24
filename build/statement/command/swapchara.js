import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.expr, X.expr);
export default class SwapChara extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [leftExpr, rightExpr] = this.arg.get();
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
