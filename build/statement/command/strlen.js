import { assertString } from "../../assert";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(U.charSeq());
export default class StrLen extends Statement {
    value;
    constructor(arg) {
        super();
        this.value = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const value = this.value.get();
        assertString(value, "Argument of STRLEN must be a string!");
        vm.getValue("RESULT").set(vm, value.length, [0]);
        return null;
    }
}
