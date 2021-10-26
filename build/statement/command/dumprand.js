import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class DumpRand extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        vm.getValue("RANDDATA").set(vm, vm.random.state, []);
        return null;
    }
}
