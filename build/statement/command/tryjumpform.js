import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";
export default class TryJumpForm extends Statement {
    static parse(raw) {
        const [target, arg] = CallForm.compileArg(raw, "(");
        return new TryJumpForm(target, arg);
    }
    target;
    arg;
    constructor(target, arg) {
        super();
        this.target = target;
        this.arg = arg;
    }
    *run(vm) {
        const target = this.target.reduce(vm).toUpperCase();
        if (vm.fnMap.has(target)) {
            return yield* new Jump(target, this.arg).run(vm);
        }
        return null;
    }
}
