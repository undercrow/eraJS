import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class FontItalic extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.font.italic = !vm.font.italic;
        return null;
    }
}
