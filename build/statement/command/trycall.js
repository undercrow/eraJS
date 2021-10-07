import Statement from "../index";
import Call from "./call";
export default class TryCall extends Statement {
    static parse(raw) {
        const [target, arg] = Call.PARSER.tryParse(raw);
        return new TryCall(target, arg);
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
            return yield* Call.exec(vm, target, this.arg);
        }
        return null;
    }
}
