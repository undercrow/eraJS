import * as assert from "../../assert";
import * as EM from "../../error";
import { parseThunk } from "../../parser/erb";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Thunk from "../../thunk";
import Statement from "../index";
const IF = /^IF\s+/i;
const ELSEIF = /^ELSEIF\s+/i;
const ELSE = /^ELSE$/i;
const ENDIF = /^ENDIF$/i;
const PARSER = U.arg1R1(E.expr);
export default class If extends Statement {
    static parse(lines, from) {
        let index = from;
        const ifThunk = [];
        let elseThunk = new Thunk([]);
        while (true) {
            if (lines.length <= index) {
                throw EM.parser("Unexpected end of thunk in IF expression");
            }
            const current = lines[index];
            index += 1;
            if (IF.test(current.content)) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l));
                ifThunk.push([current.slice("IF".length), thunk]);
                index += consumed;
            }
            else if (ELSEIF.test(current.content)) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l));
                ifThunk.push([current.slice("ELSEIF".length), thunk]);
                index += consumed;
            }
            else if (ELSE.test(current.content)) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => ENDIF.test(l));
                elseThunk = thunk;
                index += consumed;
            }
            else if (ENDIF.test(current.content)) {
                return [new If(ifThunk, elseThunk), index - from];
            }
            else {
                throw EM.parser("Unexpected statement in IF expression");
            }
        }
    }
    ifThunk;
    elseThunk;
    constructor(ifThunk, elseThunk) {
        super(ifThunk[0][0]);
        this.ifThunk = ifThunk.map(([raw, thunk]) => [
            raw,
            new Lazy(raw, PARSER),
            thunk,
        ]);
        this.elseThunk = elseThunk;
    }
    *run(vm, label) {
        if (label != null) {
            for (const [, , thunk] of this.ifThunk) {
                if (thunk.labelMap.has(label)) {
                    return yield* thunk.run(vm, label);
                }
            }
            if (this.elseThunk.labelMap.has(label)) {
                return yield* this.elseThunk.run(vm, label);
            }
        }
        for (const [, cond, thunk] of this.ifThunk) {
            const condValue = cond.get().reduce(vm);
            assert.number(condValue, "Condition should be an integer");
            if (condValue !== 0) {
                return yield* thunk.run(vm);
            }
        }
        return yield* this.elseThunk.run(vm);
    }
}
