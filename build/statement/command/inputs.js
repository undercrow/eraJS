import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(C.charSeq());
export default class InputS extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const arg = this.arg.get();
        let input = yield* vm.printer.input(false, arg != null);
        assert.string(input, "Input value for INPUTS should be a valid string");
        if (arg != null && input === "") {
            input = arg;
        }
        yield* vm.printer.print(input, new Set(["S"]));
        vm.getValue("RESULTS").set(vm, input, [0]);
        return null;
    }
}
