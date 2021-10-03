import * as U from "../../erb/util";
import * as color from "../../color";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class GetBgColor extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.getValue("RESULT").set(vm, color.toHex(vm.color.back), [0]);
        return null;
    }
}
