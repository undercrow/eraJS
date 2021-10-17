import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R1(E.expr);
export default class PrintS extends Statement {
    postfix;
    arg;
    constructor(instruction, raw) {
        super(raw);
        this.postfix = instruction.replace(/^PRINTS/, "");
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const text = this.arg.get().reduce(vm);
        assert.string(text, "1st argument of PRINTS must be a string");
        yield* vm.print(text);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
