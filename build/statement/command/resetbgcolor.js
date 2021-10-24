import * as U from "../../parser/util";
import * as color from "../../color";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class ResetBgColor extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        vm.color.back = color.copy(vm.color.defaultBack);
        return null;
    }
}
