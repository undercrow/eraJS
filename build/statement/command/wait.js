import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class Wait extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        yield* vm.queue.wait(false);
        return null;
    }
}
