import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class ClearLine extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const count = await this.arg.get().reduce(vm);
        assert.bigint(count, "Argument of CLEARLINE must be an integer!");
        yield* vm.printer.clear(Number(count));
        return null;
    }
}
