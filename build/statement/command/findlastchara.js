import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg4R2(E.variable, E.expr, E.expr, E.expr);
export default class FindLastChara extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [target, valExpr, startExpr, endExpr] = this.arg.get();
        const value = valExpr.reduce(vm);
        const start = startExpr != null ? startExpr.reduce(vm) : 0;
        assert.number(start, "3rd argument of FINDLASTCHARA must be a number");
        const end = endExpr != null ? endExpr.reduce(vm) : vm.characterList.length;
        assert.number(end, "4th argument of FINDLASTCHARA must be a number");
        let result = -1;
        const index = target.reduceIndex(vm);
        for (let i = end - 1; i >= start; --i) {
            if (target.getCell(vm).get(vm, [i, ...index]) === value) {
                result = i;
                break;
            }
        }
        vm.getValue("RESULT").set(vm, result, []);
        return null;
    }
}
