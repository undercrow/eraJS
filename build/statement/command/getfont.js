import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class GetFont extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        const result = vm.font.name;
        vm.getValue("RESULTS").set(vm, result, [0]);
        return null;
    }
}
