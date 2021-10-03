import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";
export default class TryCallForm extends Statement {
    static parse(raw) {
        const [target, arg] = CallForm.compileArg(raw, "(,");
        return new TryCallForm(target, arg);
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
            return yield* new Call(target, this.arg).run(vm);
        }
        return null;
    }
}
