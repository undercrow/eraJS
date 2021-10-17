import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Goto from "./goto";
const PARSER = U.arg1R1(E.form[""]);
export default class TryGotoForm extends Statement {
    static parse(arg) {
        return new TryGotoForm(arg);
    }
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const target = this.arg.get().reduce(vm).toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* Goto.exec(vm, target);
        }
        return null;
    }
}
