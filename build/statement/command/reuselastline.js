import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(X.form[""]);
export default class ReuseLastLine extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const value = await this.arg.get()?.reduce(vm) ?? "";
        assert.string(value, "Argument of REUSELASTLINE must be a string");
        if (!vm.queue.isLineEmpty) {
            yield* vm.queue.newline();
        }
        yield* vm.queue.print(value, new Set());
        vm.queue.isLineTemp = true;
        return null;
    }
}
