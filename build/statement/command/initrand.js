import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class InitRand extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        vm.random.state = vm.getValue("RANDDATA").get(vm, []);
        return null;
    }
}
