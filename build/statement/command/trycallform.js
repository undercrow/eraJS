import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";
export default class TryCallForm extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, CallForm.PARSER("(,"));
    }
    *run(vm) {
        const [targetExpr, argExpr] = this.arg.get();
        const target = targetExpr.reduce(vm);
        if (vm.fnMap.has(target)) {
            return yield* Call.exec(vm, target, argExpr);
        }
        return null;
    }
}
