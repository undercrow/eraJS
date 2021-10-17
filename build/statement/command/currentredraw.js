import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class CurrentRedraw extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        vm.getValue("RESULT").set(vm, vm.draw ? 0 : 1, [0]);
        return null;
    }
}
