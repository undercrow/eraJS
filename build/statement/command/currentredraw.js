import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class CurrentRedraw extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        vm.getValue("RESULT").set(vm, vm.queue.draw ? 1 : 0, [0]);
        return null;
    }
}
