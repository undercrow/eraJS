import * as E from "../../error";
import { parseThunk } from "../../parser/erb";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJump extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        if (lines.length <= index) {
            throw E.parser("Unexpected end of thunk in TRYCJUMP expression");
        }
        else if (!CATCH.test(lines[index].content)) {
            throw E.parser("Could not find CATCH for TRYCJUMP expression");
        }
        index += 1;
        const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumed + 1;
        return [new TryCJump(arg, catchThunk), index - from];
    }
    arg;
    catchExpr;
    constructor(raw, catchExpr) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
        this.catchExpr = catchExpr;
    }
    *run(vm, label) {
        const [target, argExpr] = this.arg.get();
        const realTarget = target.toUpperCase();
        if (vm.fnMap.has(realTarget)) {
            return yield* Jump.exec(vm, realTarget, argExpr);
        }
        else {
            return yield* this.catchExpr.run(vm, label);
        }
    }
}
