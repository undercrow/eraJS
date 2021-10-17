import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R1(E.expr);
export default class PrintFormS extends Statement {
    postfix;
    arg;
    constructor(instruction, raw) {
        super(raw);
        this.postfix = instruction.replace(/^PRINTFORMS/, "");
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const form = this.arg.get().reduce(vm);
        assert.string(form, "1st argument of PRINTFORMS must be a string");
        const text = E.form[""].tryParse(form).reduce(vm);
        assert.string(text, "1st argument of PRINTFORMS must be reduced to a string");
        yield* vm.print(text);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
