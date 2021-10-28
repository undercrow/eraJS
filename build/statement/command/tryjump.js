import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";
export default class TryJump extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
    }
    async *run(vm) {
        const [target, argExpr] = this.arg.get();
        const realTarget = target.toUpperCase();
        if (vm.fnMap.has(realTarget)) {
            return yield* Jump.exec(vm, realTarget, argExpr);
        }
        return null;
    }
}
