import * as assert from "../../assert";
import { parseThunk } from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const NEXT = /^NEXT$/i;
const PARSER = U.arg4R3(X.variable, X.expr, X.expr, X.expr);
export default class For extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const [thunk, consumed] = parseThunk(lines, index, (l) => NEXT.test(l));
        index += consumed + 1;
        return [new For(arg, thunk), index - from];
    }
    arg;
    thunk;
    constructor(raw, thunk) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
        this.thunk = thunk;
    }
    *run(vm, label) {
        if (label != null) {
            if (this.thunk.labelMap.has(label)) {
                return yield* this.thunk.run(vm, label);
            }
        }
        const [counter, startExpr, endExpr, stepExpr] = this.arg.get();
        const start = startExpr.reduce(vm);
        assert.number(start, "Starting value for FOR should be an integer");
        const end = endExpr.reduce(vm);
        assert.number(end, "Ending value for FOR should be an integer");
        const step = stepExpr?.reduce(vm) ?? 1;
        assert.number(step, "Step of FOR should be an integer");
        const index = counter.reduceIndex(vm);
        loop: for (let i = start; i < end; i += step) {
            counter.getCell(vm).set(vm, i, index);
            const result = yield* this.thunk.run(vm);
            switch (result?.type) {
                case "begin": return result;
                case "goto": return result;
                case "break": break loop;
                case "continue": continue loop;
                case "throw": return result;
                case "return": return result;
                case "quit": return result;
                case undefined: continue loop;
            }
        }
        return null;
    }
}
