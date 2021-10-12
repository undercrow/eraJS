import { parseThunk } from "../../erb/erb";
import Statement from "../index";
import Call from "./call";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
    static parse(lines, from) {
        let index = from;
        const [target, arg] = Call.PARSER.tryParse(lines[index].slice("TRYCCALL".length));
        index += 1;
        const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
        index += consumedT + 1;
        const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumedC + 1;
        return [new TryCCall(target, arg, thenThunk, catchThunk), index - from];
    }
    target;
    arg;
    thenThunk;
    catchThunk;
    constructor(target, arg, thenThunk, catchThunk) {
        super();
        this.target = target;
        this.arg = arg;
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
        const target = this.target.toUpperCase();
        if (vm.fnMap.has(target)) {
            yield* Call.exec(vm, target, this.arg);
            return yield* this.thenThunk.run(vm, label);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
