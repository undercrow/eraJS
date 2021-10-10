import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class LineIsEmpty extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        const result = vm.isLineEmpty ? 1 : 0;
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
