import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(C.Int);
export default class Input extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const arg = this.arg.get();
        const input = yield* vm.queue.input(true, arg != null);
        assert.cond(input != null, "Input value for INPUT should be a valid number");
        let value = Number(input);
        if (arg != null && input === "") {
            value = arg;
        }
        assert.number(value, "Input value for INPUT should be a valid number");
        vm.getValue("RESULT").set(vm, value, [0]);
        return null;
    }
}
