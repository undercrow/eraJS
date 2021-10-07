import { assertString } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.form[""]);
export default class EncodeToUni extends Statement {
    value;
    constructor(raw) {
        super();
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.value.get().reduce(vm);
        assertString(value, "1st argument of ENCODETOUNI must be a string");
        const buffer = Buffer.from(value, "utf8");
        vm.getValue("RESULT").set(vm, buffer.byteLength, [0]);
        for (let i = 0; i < buffer.byteLength; ++i) {
            vm.getValue("RESULT").set(vm, buffer[i], [i + 1]);
        }
        return null;
    }
}
