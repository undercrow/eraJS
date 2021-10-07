import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class SaveGlobal extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    // TODO: Save #DIM GLOBAL variables
    *run(vm) {
        vm.external.setGlobal("GLOBAL", JSON.stringify(vm.getValue("GLOBAL").value));
        vm.external.setGlobal("GLOBALS", JSON.stringify(vm.getValue("GLOBALS").value));
        return null;
    }
}
