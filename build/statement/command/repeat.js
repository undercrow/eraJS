import * as assert from "../../assert";
import { parseThunk } from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const REND = /^REND$/i;
const PARSER = U.arg1R1(E.expr);
export default class Repeat extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const [thunk, consumed] = parseThunk(lines, index, (l) => REND.test(l));
        index += consumed + 1;
        return [new Repeat(arg, thunk), index - from];
    }
    condition;
    thunk;
    constructor(arg, thunk) {
        super();
        this.condition = new Lazy(arg, PARSER);
        this.thunk = thunk;
    }
    *run(vm, label) {
        if (label != null) {
            if (this.thunk.labelMap.has(label)) {
                return yield* this.thunk.run(vm, label);
            }
        }
        const condition = this.condition.get().reduce(vm);
        assert.number(condition, "Condition for REPEAT should be an integer");
        loop: for (let i = 0; i < condition; ++i) {
            vm.getValue("COUNT").set(vm, i, []);
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