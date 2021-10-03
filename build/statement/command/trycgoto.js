import { parseThunk } from "../../erb/erb";
import * as U from "../../erb/util";
import Statement from "../index";
import Goto from "./goto";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
const PARSER = U.arg1R1(U.Identifier);
export default class TryCGoto extends Statement {
    static parse(lines) {
        let rest = lines.slice();
        const target = PARSER.tryParse(rest.shift().slice("TRYCGOTO".length));
        if (rest.length === 0 || !CATCH.test(rest[0])) {
            throw new Error("Expected CATCH statement");
        }
        rest.shift(); // Remove CATCH statement
        const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
        rest = restC;
        rest.shift(); // Remove ENDCATCH statement
        return [new TryCGoto(target, catchThunk), rest];
    }
    target;
    catchThunk;
    constructor(target, catchThunk) {
        super();
        this.target = target;
        this.catchThunk = catchThunk;
    }
    *run(vm, label) {
        const target = this.target.toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* new Goto(target).run(vm);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
