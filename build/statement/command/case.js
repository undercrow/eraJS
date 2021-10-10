import P from "parsimmon";
import * as assert from "../../assert";
import { parseThunk } from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
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
})), P.seqMap(P.regex(/IS/i).then(U.alt("<=", "<", ">=", ">").trim(U.WS0)), U.Int, (op, value) => ({ type: "compare", op, value })), U.Int.map((value) => ({ type: "equal", value })), U.Str.map((value) => ({ type: "equal", value }))));
export default class Case extends Statement {
    static parse(lines, from) {
        let index = from;
        const expr = lines[index].slice("SELECTCASE".length);
        index += 1;
        const branch = [];
        let def = new Thunk([]);
        while (true) {
            if (lines.length <= index) {
                throw new Error("Unexpected end of thunk!");
            }
            const current = lines[index];
            index += 1;
            if (CASE.test(current)) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => CASE.test(l) || CASEELSE.test(l) || ENDSELECT.test(l));
                branch.push([current.slice("CASE".length), thunk]);
                index += consumed;
            }
            else if (CASEELSE.test(current)) {
                const [thunk, consumed] = parseThunk(lines, index, (l) => ENDSELECT.test(l));
                def = thunk;
                index += consumed;
            }
            else if (ENDSELECT.test(current)) {
                return [new Case(expr, branch, def), index - from];
            }
            else {
                throw new Error("Unexpected statement found while parsing CASE statement");
            }
        }
    }
    expr;
    branch;
    def;
    constructor(expr, branch, def) {
        super();
        this.expr = new Lazy(expr, PARSER_EXPR);
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
        const value = this.expr.get().reduce(vm);
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
