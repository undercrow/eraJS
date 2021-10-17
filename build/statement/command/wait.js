import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class Wait extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield { type: "wait", force: false };
        return null;
    }
}
