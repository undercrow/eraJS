import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg4R2(X.expr, X.expr, X.expr, C.charSeq());
export default class TInputS extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
        const timeout = await timeoutExpr.reduce(vm);
        assert.number(timeout, "1st argument of TINPUTS should be a number");
        const def = await defExpr.reduce(vm);
        assert.string(def, "2nd argument of TINPUTS should be a string");
        const show = await showExpr?.reduce(vm) ?? 0;
        assert.number(show, "3rd argument of TINPUTS should be a number");
        const input = yield* vm.queue.tinput(false, timeout, show === 1);
        let value;
        if (input == null) {
            if (message != null) {
                yield* vm.queue.print(message, new Set(["S"]));
            }
            value = def;
        }
        else {
            value = input;
        }
        vm.getValue("RESULTS").set(vm, value, [0]);
        return null;
    }
}
