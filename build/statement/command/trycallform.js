import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";
export default class TryCallForm extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, CallForm.PARSER("(,"));
    }
    *run(vm) {
        const [targetExpr, argExpr] = this.arg.get();
        const target = targetExpr.reduce(vm).toUpperCase();
        if (vm.fnMap.has(target)) {
            return yield* Call.exec(vm, target, argExpr);
        }
        return null;
    }
}
