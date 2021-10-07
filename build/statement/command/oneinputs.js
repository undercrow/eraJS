import { assertString } from "../../assert";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(U.charSeq());
export default class OneInputS extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const arg = this.arg.get();
        let input = yield { type: "input", numeric: false };
        assertString(input, "Input value for ONEINPUTS should be a valid string");
        if (arg != null && input === "") {
            input = arg;
        }
        vm.getValue("RESULTS").set(vm, input[0], [0]);
        return null;
    }
}
