import P from "parsimmon";
import { assertString } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Statement from "../index";
import Call from "./call";
export default class CallForm extends Statement {
    static parse(raw) {
        const [target, arg] = CallForm.compileArg(raw, "(,");
        return new CallForm(target, arg);
    }
    static compileArg(arg, exclude) {
        const parser = P.alt(U.arg1R1(P.seq(E.form[exclude], U.wrap("(", ")", U.sepBy0(",", U.optional(E.expr))))), U.argNR1(E.form[exclude], U.optional(E.expr)).map(([f, ...r]) => [f, r]));
        return parser.tryParse(arg);
    }
    target;
    arg;
    constructor(target, arg) {
        super();
        this.target = target;
        this.arg = arg;
    }
    *run(vm) {
        const target = this.target.reduce(vm);
        assertString(target, "1st argument of CALLFORM must be a string");
        return yield* new Call(target, this.arg).run(vm);
    }
}
