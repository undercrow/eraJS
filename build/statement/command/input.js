import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(U.Int);
export default class Input extends Statement {
    def;
    constructor(raw) {
        super();
        this.def = new Lazy(raw, PARSER);
    }
    // TODO: Use default value
    *run(vm) {
        while (true) {
            const input = yield { type: "input" };
            const value = parseInt(input);
            if (!isNaN(value)) {
                vm.getValue("RESULT").set(vm, value, [0]);
                break;
            }
        }
        return null;
    }
}
