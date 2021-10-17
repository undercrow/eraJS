import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R1(E.expr);
export default class PrintSingleS extends Statement {
    postfix;
    arg;
    constructor(postfix, raw) {
        super(raw);
        this.postfix = postfix;
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const arg = this.arg.get().reduce(vm);
        assert.string(arg, "1st argument of PRINTSINGLES must be a string");
        yield* vm.printSingle(arg);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
