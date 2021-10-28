import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class PrintS extends Statement {
    flags;
    arg;
    constructor(flags, raw) {
        super(raw);
        this.flags = new Set(flags);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        if (vm.queue.skipDisp) {
            return null;
        }
        const value = await this.arg.get().reduce(vm);
        assert.string(value, "1st argument of PRINTS must be a string");
        yield* vm.queue.print(value, this.flags);
        return null;
    }
}
