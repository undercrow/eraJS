import * as assert from "../../assert";
import Lazy from "../../lazy";
import Statement from "../index";
import Call from "./call";
export default class CallF extends Statement {
    static async *exec(vm, target, argExpr) {
        const realTarget = target.toUpperCase();
        assert.cond(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);
        const arg = [];
        for (const a of argExpr) {
            arg.push(await a?.reduce(vm));
        }
        const result = yield* vm.fnMap.get(realTarget).run(vm, arg);
        switch (result?.type) {
            case "begin": return result;
            case "goto": return result;
            case "break": return result;
            case "continue": return result;
            case "throw": return result;
            case "return": return null;
            case "quit": return result;
            case undefined: return null;
        }
    }
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, Call.PARSER);
    }
    async *run(vm) {
        const [target, argExpr] = this.arg.get();
        return yield* CallF.exec(vm, target, argExpr);
    }
}
