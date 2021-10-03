import { assertNumber } from "../../assert";
import { parseThunk } from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Thunk from "../../thunk";
import Statement from "../index";
const IF = /^IF\s+/i;
const ELSEIF = /^ELSEIF\s+/i;
const ELSE = /^ELSE$/i;
const ENDIF = /^ENDIF$/i;
const PARSER = U.arg1R1(E.expr);
export default class If extends Statement {
    static parse(lines) {
        let rest = lines.slice();
        const ifThunk = [];
        let elseThunk = new Thunk([]);
        while (true) {
            const current = rest.shift();
            if (current == null) {
                throw new Error("Unexpected end of thunk!");
            }
            if (IF.test(current)) {
                const [thunk, restT] = parseThunk(rest, (l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l));
                ifThunk.push([current.slice("IF".length), thunk]);
                rest = restT;
            }
            else if (ELSEIF.test(current)) {
                const [thunk, restT] = parseThunk(rest, (l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l));
                ifThunk.push([current.slice("ELSEIF".length), thunk]);
                rest = restT;
            }
            else if (ELSE.test(current)) {
                [elseThunk, rest] = parseThunk(rest, (l) => ENDIF.test(l));
            }
            else if (ENDIF.test(current)) {
                return [new If(ifThunk, elseThunk), rest];
            }
            else {
                throw new Error("Unexpected statement found while parsing IF statement");
            }
        }
    }
    ifThunk;
    elseThunk;
    constructor(ifThunk, elseThunk) {
        super();
        this.ifThunk = ifThunk.map(([cond, thunk]) => [
            new Lazy(cond, PARSER),
            thunk,
        ]);
        this.elseThunk = elseThunk;
    }
    *run(vm, label) {
        if (label != null) {
            for (const [, thunk] of this.ifThunk) {
                if (thunk.labelMap.has(label)) {
                    return yield* thunk.run(vm, label);
                }
            }
            if (this.elseThunk.labelMap.has(label)) {
                return yield* this.elseThunk.run(vm, label);
            }
        }
        for (let i = 0; i < this.ifThunk.length; ++i) {
            const [cond, thunk] = this.ifThunk[i];
            const condValue = cond.get().reduce(vm);
            assertNumber(condValue, "Condition should be an integer");
            if (condValue !== 0) {
                return yield* thunk.run(vm);
            }
        }
        return yield* this.elseThunk.run(vm);
    }
}
