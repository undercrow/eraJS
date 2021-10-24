import * as assert from "../../assert";
import { parseThunk } from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const WEND = /^WEND$/i;
const PARSER = U.arg1R1(X.expr);
export default class While extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const [thunk, consumed] = parseThunk(lines, index, (l) => WEND.test(l));
        index += consumed + 1;
        return [new While(arg, thunk), index - from];
    }
    arg;
    thunk;
    constructor(raw, thunk) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
        this.thunk = thunk;
    }
    *run(vm, label) {
        let firstLoop = true;
        while (true) {
            let result;
            if (firstLoop && label != null && this.thunk.labelMap.has(label)) {
                result = yield* this.thunk.run(vm, label);
            }
            else {
                const condition = this.arg.get().reduce(vm);
                assert.number(condition, "Condition of WHILE should be an integer");
                if (condition === 0) {
                    break;
                }
                result = yield* this.thunk.run(vm);
            }
            firstLoop = false;
            switch (result?.type) {
                case "begin": return result;
                case "goto": return result;
                case "break": return null;
                case "continue": continue;
                case "throw": return result;
                case "return": return result;
                case "quit": return result;
                case undefined: continue;
            }
        }
        return null;
    }
}
