import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(U.charSeq());
export default class InputS extends Statement {
    def;
    constructor(raw) {
        super();
        this.def = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const input = yield { type: "input" };
        let value;
        if (input !== "") {
            value = input;
        }
        else {
            value = this.def.get() ?? "";
        }
        vm.getValue("RESULTS").set(vm, value, [0]);
        return null;
    }
}
