import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class ClearLine extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const count = this.arg.get().reduce(vm);
        assert.number(count, "Argument of CLEARLINE must be an integer!");
        yield { type: "clearline", count };
        const lineCount = vm.getValue("LINECOUNT").get(vm, [0]);
        vm.getValue("LINECOUNT").set(vm, lineCount - count, []);
        return null;
    }
}
