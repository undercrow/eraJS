import * as assert from "../../assert";
import Lazy from "../../lazy";
import Statement from "../index";
import CallF from "./callf";
import CallForm from "./callform";
export default class CallFormF extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, CallForm.PARSER("(,"));
    }
    *run(vm) {
        const [targetExpr, argExpr] = this.arg.get();
        const target = targetExpr.reduce(vm);
        assert.string(target, "1st argument of CALLFORMF must be a string");
        return yield* CallF.exec(vm, target, argExpr);
    }
}
