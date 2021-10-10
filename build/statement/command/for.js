import * as assert from "../../assert";
import { parseThunk } from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Statement from "../index";
const NEXT = /^NEXT$/i;
const PARSER = U.arg4R3(E.variable, E.expr, E.expr, E.expr);
export default class For extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const [thunk, consumed] = parseThunk(lines, index, (l) => NEXT.test(l));
        index += consumed + 1;
        return [new For(arg, thunk), index - from];
    }
    raw;
    thunk;
    counter;
    start;
    end;
    step;
    constructor(raw, thunk) {
        super();
        this.raw = raw;
        this.thunk = thunk;
    }
    compile() {
        if (this.counter == null) {
            [this.counter, this.start, this.end, this.step] = PARSER.tryParse(this.raw);
        }
    }
    *run(vm, label) {
        this.compile();
        if (label != null) {
            if (this.thunk.labelMap.has(label)) {
                return yield* this.thunk.run(vm, label);
            }
        }
        const start = this.start.reduce(vm);
        assert.number(start, "Starting value for FOR should be an integer");
        const end = this.end.reduce(vm);
        assert.number(end, "Ending value for FOR should be an integer");
        const step = this.step?.reduce(vm) ?? 1;
        assert.number(step, "Step of FOR should be an integer");
        const index = this.counter.reduceIndex(vm);
        loop: for (let i = start; i < end; i += step) {
            this.counter.getCell(vm).set(vm, i, index);
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
