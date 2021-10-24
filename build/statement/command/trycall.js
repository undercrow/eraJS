import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
export default class TryCall extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
    }
    *run(vm) {
        const [target, argExpr] = this.arg.get();
        const realTarget = target.toUpperCase();
        if (vm.fnMap.has(realTarget)) {
            return yield* Call.exec(vm, realTarget, argExpr);
        }
        return null;
    }
}
