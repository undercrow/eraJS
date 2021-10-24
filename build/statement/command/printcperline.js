import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class PrintCPerLine extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        vm.getValue("RESULT").set(vm, vm.printCPerLine, [0]);
        return null;
    }
}
