import P from "parsimmon";
import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
export default class CallForm extends Statement {
    static PARSER(exclude) {
        return P.alt(U.arg1R1(P.seq(E.form[exclude], U.wrap("(", ")", U.sepBy0(",", U.optional(E.expr))))), U.argNR1(E.form[exclude], U.optional(E.expr)).map(([f, ...r]) => [f, r]));
    }
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, CallForm.PARSER("(,"));
    }
    *run(vm) {
        const [targetExpr, argExpr] = this.arg.get();
        const target = targetExpr.reduce(vm);
        assert.string(target, "1st argument of CALLFORM must be a string");
        return yield* Call.exec(vm, target, argExpr);
    }
}
