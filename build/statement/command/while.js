import { assertNumber } from "../../assert";
import { parseThunk } from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const WEND = /^WEND$/i;
const PARSER = U.arg1R1(E.expr);
export default class While extends Statement {
    static parse(arg, lines) {
        const [thunk, rest] = parseThunk(lines, (l) => WEND.test(l));
        rest.shift(); // Remove REND statement
        return [new While(arg, thunk), rest];
    }
    condition;
    thunk;
    constructor(arg, thunk) {
        super();
        this.condition = new Lazy(arg, PARSER);
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
                const condition = this.condition.get().reduce(vm);
                assertNumber(condition, "Condition of WHILE should be an integer");
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
