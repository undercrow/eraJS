import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class InitRand extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        vm.random.state = vm.getValue("RANDDATA").get(vm, []);
        return null;
    }
}
