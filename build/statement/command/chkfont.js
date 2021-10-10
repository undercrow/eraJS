import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class ChkFont extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const arg = this.arg.get().reduce(vm);
        assert.string(arg, "1st argument of CHKFONT should be a string");
        const result = vm.external.getFont(arg) ? 1 : 0;
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
