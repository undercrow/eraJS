import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Goto from "./goto";
const PARSER = U.arg1R1(C.Identifier);
export default class TryGoto extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const target = this.arg.get().toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* Goto.exec(vm, target);
        }
        return null;
    }
}
