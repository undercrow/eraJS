import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg4R2(E.expr, E.expr, E.expr, U.charSeq());
export default class TOneInputS extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [timeoutExpr, defExpr, showExpr, message] = this.arg.get();
        const timeout = timeoutExpr.reduce(vm);
        assert.number(timeout, "1st argument of TONEINPUTS should be a number");
        const def = defExpr.reduce(vm);
        assert.string(def, "2nd argument of TONEINPUTS should be a string");
        const show = showExpr?.reduce(vm) ?? 0;
        assert.number(show, "3rd argument of TONEINPUTS should be a number");
        const input = yield {
            type: "input",
            numeric: false,
            timeout,
            showClock: show === 1,
        };
        let value;
        if (input == null) {
            if (message != null) {
                yield* vm.printSingle(message);
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
