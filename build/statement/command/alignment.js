import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT"));
export default class Alignment extends Statement {
    align;
    constructor(arg) {
        super();
        this.align = PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.alignment = this.align;
        return null;
    }
}
