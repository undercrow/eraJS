import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(C.charSeq());
export default class OneInputS extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const arg = this.arg.get();
        let input = yield* vm.queue.input(false);
        assert.string(input, "Input value for ONEINPUTS should be a valid string");
        if (arg != null && input === "") {
            input = arg;
        }
        vm.getValue("RESULTS").set(vm, input[0], [0]);
        return null;
    }
}
