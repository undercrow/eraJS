import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg4R2(X.expr, X.expr, X.expr, C.charSeq());
export default class TInput extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
        const timeout = timeoutExpr.reduce(vm);
        assert.number(timeout, "1st argument of TINPUT should be a number");
        const def = defExpr.reduce(vm);
        assert.number(def, "2nd argument of TINPUT should be a number");
        const show = showExpr?.reduce(vm) ?? 0;
        assert.number(show, "3rd argument of TINPUT should be a number");
        const input = yield* vm.queue.tinput(true, timeout, show === 1);
        let value;
        if (input == null) {
            if (message != null) {
                yield* vm.queue.print(message, new Set(["S"]));
            }
            value = def;
        }
        else {
            value = Number(input);
        }
        assert.number(value, "Input value for TINPUT should be a valid number");
        vm.getValue("RESULT").set(vm, value, [0]);
        return null;
    }
}
