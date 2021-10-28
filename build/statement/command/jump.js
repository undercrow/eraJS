import * as assert from "../../assert";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
export default class Jump extends Statement {
    static async *exec(vm, target, argExpr) {
        const realTarget = target.toUpperCase();
        assert.cond(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);
        const arg = [];
        for (const a of argExpr) {
            arg.push(await a?.reduce(vm));
        }
        return yield* vm.fnMap.get(realTarget).run(vm, arg);
    }
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
    }
    async *run(vm) {
        const [target, argExpr] = this.arg.get();
        return yield* Jump.exec(vm, target, argExpr);
    }
}
