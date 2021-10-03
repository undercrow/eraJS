import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";
export default class JumpForm extends Statement {
    static parse(raw) {
        const [target, arg] = CallForm.compileArg(raw, "(");
        return new JumpForm(target, arg);
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
        return yield* new Jump(target, this.arg).run(vm);
    }
}
