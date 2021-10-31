import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(C.Identifier);
export default class Goto extends Statement {
    static *exec(vm, target) {
        const realTarget = target.toUpperCase();
        const context = vm.context();
        assert.cond(context.fn.thunk.labelMap.has(realTarget), `Label ${realTarget} does not exist`);
        return {
            type: "goto",
            label: target,
        };
    }
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        const target = this.arg.get();
        return yield* Goto.exec(vm, target);
    }
}
