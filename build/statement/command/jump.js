import { assert } from "../../assert";
import Statement from "../index";
import Call from "./call";
export default class Jump extends Statement {
    static parse(raw) {
        const [target, arg] = Call.compileArg(raw);
        return new Jump(target, arg);
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
        assert(vm.fnMap.has(target), `Function ${target} does not exist`);
        const arg = this.arg.map((a) => a?.reduce(vm));
        return yield* vm.fnMap.get(target).run(vm, arg);
    }
}
