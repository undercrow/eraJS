import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    // TODO: Load #DIM GLOBAL variables
    *run(vm) {
        const rawGlobal = vm.external.getGlobal("GLOBAL");
        if (rawGlobal != null) {
            vm.getValue("GLOBAL").reset(JSON.parse(rawGlobal));
        }
        const rawGlobalS = vm.external.getGlobal("GLOBALS");
        if (rawGlobalS != null) {
            vm.getValue("GLOBALS").reset(JSON.parse(rawGlobalS));
        }
        return null;
    }
}
