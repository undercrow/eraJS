import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class PrintCPerLine extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.getValue("RESULT").set(vm, vm.printCPerLine, [0]);
        return null;
    }
}
