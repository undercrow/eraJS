import * as assert from "../../assert";
import { parseThunk } from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const LOOP = /^LOOP\s+/i;
const PARSER_ARG = U.arg0R0();
const PARSER_COND = U.arg1R1(X.expr);
export default class DoWhile extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        U.tryParse(PARSER_ARG, arg);
        const [thunk, consumed] = parseThunk(lines, index, (l) => LOOP.test(l));
        index += consumed;
        const condition = lines[index].slice("LOOP".length);
        index += 1;
        return [new DoWhile(condition, thunk), index - from];
    }
    arg;
    thunk;
    constructor(raw, thunk) {
        super(raw);
        this.arg = new Lazy(raw, PARSER_COND);
        this.thunk = thunk;
    }
    async *run(vm, label) {
        let firstLoop = true;
        while (true) {
            const result = yield* this.thunk.run(vm, firstLoop ? label : undefined);
            const condition = await this.arg.get().reduce(vm);
            assert.number(condition, "Condition of DO should be an integer");
            if (condition === 0) {
                break;
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
