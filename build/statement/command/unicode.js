import { assert, assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class Unicode extends Statement {
    value;
    constructor(raw) {
        super();
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.value.get().reduce(vm);
        assertNumber(value, "1st argument of UNICODE must be an integer");
        assert(value >= 0 && value <= 0xFFFF, "1st argument of UNICODE must be between 0 and 0xFFFF");
        vm.getValue("RESULTS").set(vm, String.fromCharCode(value), [0]);
        return null;
    }
}
