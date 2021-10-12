import { parseThunk } from "../../erb/erb";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";
const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJumpForm extends Statement {
    static parse(lines, from) {
        let index = from;
        const [target, arg] = CallForm.PARSER("").tryParse(lines[index].slice("TRYCJUMPFORM".length));
        index += 1;
        if (lines.length <= index || !CATCH.test(lines[index])) {
            throw new Error("Expected CATCH statement");
        }
        index += 1;
        const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
        index += consumed + 1;
        return [new TryCJumpForm(target, arg, catchThunk), index - from];
    }
    target;
    arg;
    catchThunk;
    constructor(target, arg, catchThunk) {
        super();
        this.target = target;
        this.arg = arg;
        this.catchThunk = catchThunk;
    }
    *run(vm, label) {
        const target = this.target.reduce(vm).toUpperCase();
        if (vm.fnMap.has(target)) {
            return yield* Jump.exec(vm, target, this.arg);
        }
        else {
            return yield* this.catchThunk.run(vm, label);
        }
    }
}
