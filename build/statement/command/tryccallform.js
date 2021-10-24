import { parseThunk } from "../../parser/erb";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCallForm extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
        index += consumedT + 1;
        const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumedC + 1;
        return [new TryCCallForm(arg, thenThunk, catchThunk), index - from];
    }
    arg;
    thenThunk;
    catchThunk;
    constructor(raw, thenThunk, catchThunk) {
        super(raw);
        this.arg = new Lazy(raw, CallForm.PARSER(""));
        this.thenThunk = thenThunk;
        this.catchThunk = catchThunk;
    }
    *run(vm, label) {
        if (label != null && this.thenThunk.labelMap.has(label)) {
            return yield* this.thenThunk.run(vm, label);
        }
        if (label != null && this.catchThunk.labelMap.has(label)) {
            return yield* this.catchThunk.run(vm, label);
        }
        const [targetExpr, argExpr] = this.arg.get();
        const target = targetExpr.reduce(vm).toUpperCase();
        if (vm.fnMap.has(target)) {
            yield* Call.exec(vm, target, argExpr);
            return yield* this.thenThunk.run(vm, label);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
