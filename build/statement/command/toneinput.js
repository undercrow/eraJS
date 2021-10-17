import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg4R2(E.expr, E.expr, E.expr, U.charSeq());
export default class TOneInput extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
        const timeout = timeoutExpr.reduce(vm);
        assert.number(timeout, "1st argument of TONEINPUT should be a number");
        const def = defExpr.reduce(vm);
        assert.number(def, "2nd argument of TONEINPUT should be a number");
        const show = showExpr?.reduce(vm) ?? 0;
        assert.number(show, "3rd argument of TONEINPUT should be a number");
        const input = yield {
            type: "input",
            timeout,
            showClock: show === 1,
            numeric: true,
        };
        let value;
        if (input == null) {
            if (message != null) {
                yield* vm.printSingle(message);
            }
            value = def;
        }
        else {
            value = Number(input[0]);
        }
        assert.number(value, "First value of input for TONEINPUT should be a valid number");
        vm.getValue("RESULT").set(vm, value, [0]);
        return null;
    }
}
