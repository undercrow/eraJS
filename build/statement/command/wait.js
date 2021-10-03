import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class Wait extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield { type: "wait" };
        return null;
    }
}
