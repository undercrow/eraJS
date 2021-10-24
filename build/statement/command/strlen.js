import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(C.charSeq());
export default class StrLen extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.arg.get();
        assert.string(value, "Argument of STRLEN must be a string!");
        vm.getValue("RESULT").set(vm, value.length, [0]);
        return null;
    }
}
