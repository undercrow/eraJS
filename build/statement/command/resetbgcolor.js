import * as U from "../../erb/util";
import * as color from "../../color";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class ResetBgColor extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.color.back = color.copy(vm.color.defaultBack);
        return null;
    }
}
