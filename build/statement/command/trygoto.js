import * as U from "../../erb/util";
import Statement from "../index";
import Goto from "./goto";
const PARSER = U.arg1R1(U.Identifier);
export default class TryGoto extends Statement {
    static parse(raw) {
        const target = PARSER.tryParse(raw);
        return new TryGoto(target);
    }
    target;
    constructor(target) {
        super();
        this.target = target;
    }
    *run(vm) {
        const target = this.target.toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* new Goto(this.target).run(vm);
        }
        return null;
    }
}
