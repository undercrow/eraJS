import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class CurrentRedraw extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.getValue("RESULT").set(vm, vm.draw ? 0 : 1, [0]);
        return null;
    }
}
