import P from "parsimmon";
import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
export default class Call extends Statement {
    static PARSER = P.alt(U.arg1R1(P.seq(U.Identifier.skip(U.WS0), U.wrap("(", ")", U.sepBy0(",", U.optional(E.expr))))), U.argNR1(U.Identifier, U.optional(E.expr)).map(([f, ...r]) => [f, r]));
    static *exec(vm, target, argExpr) {
        const realTarget = target.toUpperCase();
        assert.cond(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);
        const arg = argExpr.map((a) => a?.reduce(vm));
        const result = yield* vm.fnMap.get(realTarget).run(vm, arg);
        switch (result?.type) {
            case "begin": return result;
            case "goto": return result;
            case "break": return result;
            case "continue": return result;
            case "throw": return result;
            case "return": {
                for (let i = 0; i < result.value.length; ++i) {
                    vm.getValue("RESULT").set(vm, result.value[i], [i]);
                }
                return null;
            }
            case "quit": return result;
            case undefined: {
                vm.getValue("RESULT").set(vm, 0, [0]);
                return null;
            }
        }
    }
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
    }
    *run(vm) {
        const [target, argExpr] = this.arg.get();
        return yield* Call.exec(vm, target, argExpr);
    }
}
