import { assert } from "../../assert";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
export default class Jump extends Statement {
    static *exec(vm, target, argExpr) {
        const realTarget = target.toUpperCase();
        assert(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);
        const arg = argExpr.map((a) => a?.reduce(vm));
        return yield* vm.fnMap.get(realTarget).run(vm, arg);
    }
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, Call.PARSER);
    }
    *run(vm) {
        const [target, argExpr] = this.arg.get();
        return yield* Jump.exec(vm, target, argExpr);
    }
}
