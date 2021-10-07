import { parseThunk } from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Statement from "../index";
import Goto from "./goto";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
const PARSER = U.arg1R1(E.form[""]);
export default class TryCGotoForm extends Statement {
    static parse(lines, from) {
        let index = from;
        const target = PARSER.tryParse(lines[index].slice("TRYCGOTOFORM".length));
        index += 1;
        if (lines.length <= index || !CATCH.test(lines[index])) {
            throw new Error("Expected CATCH statement");
        }
        index += 1;
        const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumed + 1;
        return [new TryCGotoForm(target, catchThunk), index - from];
    }
    target;
    catchThunk;
    constructor(target, catchThunk) {
        super();
        this.target = target;
        this.catchThunk = catchThunk;
    }
    *run(vm, label) {
        const target = this.target.reduce(vm).toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* new Goto(target).run(vm);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
