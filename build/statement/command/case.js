import P from "parsimmon";
import * as assert from "../../assert";
import * as EM from "../../error";
import { parseThunk } from "../../parser/erb";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Thunk from "../../thunk";
import Statement from "../index";
const CASE = /^CASE\s+/i;
const CASEELSE = /^CASEELSE$/i;
const ENDSELECT = /^ENDSELECT$/i;
const PARSER_EXPR = U.arg1R1(E.expr);
const PARSER_BRANCH = U.argNR0(P.alt(P.seqMap(U.Int, P.regex(/TO/i).trim(U.WS1).then(U.Int), (from, to) => ({
    type: "range",
    from,
    to,
})), P.seqMap(P.regex(/IS/i).then(U.alt("<=", "<", ">=", ">").trim(U.WS0)), E.expr, (op, value) => ({ type: "compare", op, value })), U.Int.map((value) => ({ type: "equal", value })), U.Str.map((value) => ({ type: "equal", value }))));
export default class Case extends Statement {
    static parse(arg, lines, from) {
        let index = from + 1;
        const branch = [];
        let def = new Thunk([]);
        while (true) {
            if (lines.length <= index) {
                throw EM.parser("Unexpected end of thunk in CASE expression");
            }
            const current = lines[index];
            index += 1;
            if (CASE.test(current.get())) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => CASE.test(l) || CASEELSE.test(l) || ENDSELECT.test(l));
                branch.push([current.slice("CASE".length), thunk]);
                index += consumed;
            }
            else if (CASEELSE.test(current.get())) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => ENDSELECT.test(l));
                def = thunk;
                index += consumed;
            }
            else if (ENDSELECT.test(current.get())) {
                return [new Case(arg, branch, def), index - from];
            }
            else {
                throw EM.parser("Unexpected statement in CASE expression");
            }
        }
    }
    arg;
    branch;
    def;
    constructor(raw, branch, def) {
        super(raw);
        this.arg = new Lazy(raw, PARSER_EXPR);
        this.branch = branch.map(([cond, thunk]) => [new Lazy(cond, PARSER_BRANCH), thunk]);
        this.def = def;
    }
    *run(vm, label) {
        if (label != null) {
            for (const [, thunk] of this.branch) {
                if (thunk.labelMap.has(label)) {
                    return yield* thunk.run(vm, label);
                }
            }
        }
        const value = this.arg.get().reduce(vm);
        for (const [cond, expr] of this.branch) {
            const satisfied = cond.get().some((c) => {
                switch (c.type) {
                    case "equal": return c.value === value;
                    case "range": return c.from <= value && value <= c.to;
                    case "compare": {
                        assert.number(value, "CASE IS ... should be used for an integer value");
                        switch (c.op) {
                            case "<": return value < c.value;
                            case "<=": return value <= c.value;
                            case ">": return value > c.value;
                            case ">=": return value >= c.value;
                        }
                    }
                }
            });
            if (satisfied) {
                return yield* expr.run(vm);
            }
        }
        return null;
    }
}
