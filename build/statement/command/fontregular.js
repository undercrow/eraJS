import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class FontRegular extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.font.bold = false;
        vm.font.italic = false;
        vm.font.strike = false;
        vm.font.underline = false;
        return null;
    }
}
