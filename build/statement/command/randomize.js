import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class Randomize extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const seed = await this.arg.get().reduce(vm);
        assert.bigint(seed, "1st argument of RANDOMIZE must be a number");
        vm.random.state = Number(seed);
        return null;
    }
}
