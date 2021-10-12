import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class GetFont extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        const result = vm.font.name;
        vm.getValue("RESULTS").set(vm, result, [0]);
        return null;
    }
}
