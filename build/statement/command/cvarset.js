import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg5R1(X.variable, X.expr, X.expr, X.expr, X.expr);
export default class VarSet extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [destExpr, indexExpr, valueExpr, startExpr, endExpr] = this.arg.get();
        const index = indexExpr?.reduce(vm) ?? 0;
        assert.number(index, "2nd argument of CVARSET must be a number");
        const value = valueExpr?.reduce(vm);
        const start = startExpr?.reduce(vm) ?? 0;
        assert.number(start, "4th argument of CVARSET must be a number");
        const end = endExpr?.reduce(vm) ?? vm.characterList.length;
        assert.number(end, "5th argument of CVARSET must be a number");
        for (let i = start; i < end; ++i) {
            const character = vm.characterList[i];
            const cell = character.getValue(destExpr.name);
            if (value != null) {
                cell.set(vm, value, [index]);
            }
            else {
                if (cell.type === "number") {
                    cell.set(vm, 0, [index]);
                }
                else {
                    cell.set(vm, "", [index]);
                }
            }
        }
        return null;
    }
}
