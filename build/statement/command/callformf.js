import { assertString } from "../../assert";
import Statement from "../index";
import CallF from "./callf";
import CallForm from "./callform";
export default class CallFormF extends Statement {
    static parse(raw) {
        const [target, arg] = CallForm.compileArg(raw, "(,");
        return new CallFormF(target, arg);
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
        assertString(target, "1st argument of CALLFORMF must be a string");
        return yield* new CallF(target, this.arg).run(vm);
    }
}
