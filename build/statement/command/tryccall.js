import { parseThunk } from "../../erb/erb";
import Statement from "../index";
import Call from "./call";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
    static parse(lines) {
        let rest = lines.slice();
        const [target, arg] = Call.compileArg(rest.shift().slice("TRYCCALL".length));
        const [thenThunk, restT] = parseThunk(rest, (l) => CATCH.test(l));
        rest = restT;
        rest.shift(); // Remove CATCH statement
        const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
        rest = restC;
        rest.shift(); // Remove ENDCATCH statement
        return [new TryCCall(target, arg, thenThunk, catchThunk), rest];
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
            yield* new Call(target, this.arg).run(vm);
            return yield* this.thenThunk.run(vm, label);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
