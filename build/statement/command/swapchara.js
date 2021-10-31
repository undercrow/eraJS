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
    async *run(vm) {
        const [leftExpr, rightExpr] = this.arg.get();
        const left = await leftExpr.reduce(vm);
        assert.bigint(left, "1st argument of SWAPCHARA must be a number");
        const right = await rightExpr.reduce(vm);
        assert.bigint(right, "2nd argument of SWAPCHARA must be a number");
        const temp = vm.characterList[Number(left)];
        vm.characterList[Number(left)] = vm.characterList[Number(right)];
        vm.characterList[Number(right)] = temp;
        return null;
    }
}
