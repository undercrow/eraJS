import P from "parsimmon";
import { assert } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = P.alt(U.arg1R1(P.seq(U.Identifier.skip(U.WS0), U.wrap("(", ")", U.sepBy0(",", U.optional(E.expr))))), U.argNR1(U.Identifier, U.optional(E.expr)).map(([f, ...r]) => [f, r]));
export default class Call extends Statement {
    static parse(raw) {
        const [target, arg] = Call.compileArg(raw);
        return new Call(target, arg);
    }
    static compileArg(arg) {
        return PARSER.tryParse(arg);
    }
    target;
    arg;
    constructor(target, arg) {
        super();
        this.target = target;
        this.arg = arg;
    }
    *run(vm) {
        const target = this.target.toUpperCase();
        assert(vm.fnMap.has(target), `Function ${target} does not exist`);
        const arg = this.arg.map((a) => a?.reduce(vm));
        const result = yield* vm.fnMap.get(target).run(vm, arg);
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
}
