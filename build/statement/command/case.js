import P from "parsimmon";
import { assertNumber } from "../../assert";
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
    static parse(lines) {
        let rest = lines.slice();
        const expr = rest.shift().slice("SELECTCASE".length);
        const branch = [];
        let def = new Thunk([]);
        while (true) {
            const current = rest.shift();
            if (current == null) {
                throw new Error("Unexpected end of thunk!");
            }
            if (CASE.test(current)) {
                const [thunk, restT] = parseThunk(rest, (l) => CASE.test(l) || CASEELSE.test(l) || ENDSELECT.test(l));
                branch.push([current.slice("CASE".length), thunk]);
                rest = restT;
            }
            else if (CASEELSE.test(current)) {
                [def, rest] = parseThunk(rest, (l) => ENDSELECT.test(l));
            }
            else if (ENDSELECT.test(current)) {
                return [new Case(expr, branch, def), rest];
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
                        assertNumber(value, "CASE IS ... should be used for an integer value");
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
