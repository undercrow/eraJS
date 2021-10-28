import * as E from "../../error";
import { parseThunk } from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Goto from "./goto";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
const PARSER = U.arg1R1(X.form[""]);
export default class TryCGotoForm extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        if (lines.length <= index) {
            throw E.parser("Unexpected end of thunk in TRYCGOTOFORM expression");
        }
        else if (!CATCH.test(lines[index].content)) {
            throw E.parser("Could not find CATCH for TRYCGOTOFORM expression");
        }
        index += 1;
        const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumed + 1;
        return [new TryCGotoForm(arg, catchThunk), index - from];
    }
    arg;
    catchThunk;
    constructor(raw, catchThunk) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
        this.catchThunk = catchThunk;
    }
    async *run(vm, label) {
        const target = (await this.arg.get().reduce(vm)).toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* Goto.exec(vm, target);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
