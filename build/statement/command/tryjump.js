import Statement from "../index";
import Call from "./call";
import Jump from "./jump";
export default class TryJump extends Statement {
    static parse(raw) {
        const [target, arg] = Call.compileArg(raw);
        return new TryJump(target, arg);
    }
    target;
    arg;
    constructor(target, arg) {
        super();
        this.target = target;
        this.arg = arg;
    }
    *run(vm) {
        const target = this.target.toUpperCase();
        if (vm.fnMap.has(target)) {
            return yield* new Jump(target, this.arg).run(vm);
        }
        return null;
    }
}
