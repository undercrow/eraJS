import { parseThunk } from "../../erb/erb";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJump extends Statement {
    static parse(lines) {
        let rest = lines.slice();
        const [target, arg] = Call.compileArg(rest.shift().slice("TRYCJUMP".length));
        if (rest.length === 0 || !CATCH.test(rest[0])) {
            throw new Error("Expected CATCH statement");
        }
        rest.shift(); // Remove CATCH statement
        const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
        rest = restC;
        rest.shift(); // Remove ENDCATCH statement
        return [new TryCJump(target, arg, catchThunk), rest];
    }
    target;
    arg;
    catchExpr;
    constructor(target, arg, catchExpr) {
        super();
        this.target = target;
        this.arg = arg;
        this.catchExpr = catchExpr;
    }
    *run(vm, label) {
        const target = this.target.toUpperCase();
        if (vm.fnMap.has(target)) {
            return yield* new Jump(this.target, this.arg).run(vm);
        }
        else {
            return yield* this.catchExpr.run(vm, label);
        }
    }
}
