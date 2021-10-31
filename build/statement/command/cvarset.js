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
    async *run(vm) {
        const [destExpr, indexExpr, valueExpr, startExpr, endExpr] = this.arg.get();
        const index = await indexExpr?.reduce(vm) ?? 0n;
        assert.bigint(index, "2nd argument of CVARSET must be a number");
        const value = await valueExpr?.reduce(vm);
        const start = await startExpr?.reduce(vm) ?? 0n;
        assert.bigint(start, "4th argument of CVARSET must be a number");
        const end = await endExpr?.reduce(vm) ?? BigInt(vm.characterList.length);
        assert.bigint(end, "5th argument of CVARSET must be a number");
        for (let i = start; i < end; ++i) {
            const character = vm.characterList[Number(i)];
            const cell = character.getValue(destExpr.name);
            if (value != null) {
                cell.set(vm, value, [Number(index)]);
            }
            else {
                if (cell.type === "number") {
                    cell.set(vm, 0n, [Number(index)]);
                }
                else {
                    cell.set(vm, "", [Number(index)]);
                }
            }
        }
        return null;
    }
}
