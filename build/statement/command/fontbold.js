import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class FontBold extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.font.bold = !vm.font.bold;
        return null;
    }
}
