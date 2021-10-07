import * as U from "../../erb/util";
import * as color from "../../color";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class ResetColor extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.color.front = color.copy(vm.color.defaultFront);
        return null;
    }
}
