import * as E from "../../error";
import { parseThunk } from "../../parser/erb";
import Lazy from "../../lazy";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJumpForm extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        if (lines.length <= index) {
            throw E.parser("Unexpected end of thunk in TRYCJUMPFORM expression");
        }
        else if (!CATCH.test(lines[index].content)) {
            throw E.parser("Could not find CATCH for TRYCJUMPFORM expression");
        }
        index += 1;
        const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumed + 1;
        return [new TryCJumpForm(arg, catchThunk), index - from];
    }
    arg;
    catchThunk;
    constructor(raw, catchThunk) {
        super(raw);
        this.arg = new Lazy(raw, CallForm.PARSER(""));
        this.catchThunk = catchThunk;
    }
    async *run(vm, label) {
        const [targetExpr, argExpr] = this.arg.get();
        const target = (await targetExpr.reduce(vm)).toUpperCase();
        if (vm.fnMap.has(target)) {
            return yield* Jump.exec(vm, target, argExpr);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
