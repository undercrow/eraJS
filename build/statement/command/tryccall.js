import { parseThunk } from "../../parser/erb";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
        index += consumedT + 1;
        const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumedC + 1;
        return [new TryCCall(arg, thenThunk, catchThunk), index - from];
    }
    arg;
    thenThunk;
    catchThunk;
    constructor(raw, thenThunk, catchThunk) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
        this.thenThunk = thenThunk;
        this.catchThunk = catchThunk;
    }
    async *run(vm, label) {
        if (label != null && this.thenThunk.labelMap.has(label)) {
            return yield* this.thenThunk.run(vm, label);
        }
        if (label != null && this.catchThunk.labelMap.has(label)) {
            return yield* this.catchThunk.run(vm, label);
        }
        const [target, argExpr] = this.arg.get();
        const realTarget = target.toUpperCase();
        if (vm.fnMap.has(realTarget)) {
            yield* Call.exec(vm, realTarget, argExpr);
            return yield* this.thenThunk.run(vm, label);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
