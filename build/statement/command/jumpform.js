import Lazy from "../../lazy";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";
export default class JumpForm extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, CallForm.PARSER("("));
    }
    *run(vm) {
        const [targetExpr, argExpr] = this.arg.get();
        const target = targetExpr.reduce(vm);
        return yield* Jump.exec(vm, target, argExpr);
    }
}