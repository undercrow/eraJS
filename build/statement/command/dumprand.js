import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class DumpRand extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.getValue("RANDDATA").set(vm, vm.random.state, []);
        return null;
    }
}
