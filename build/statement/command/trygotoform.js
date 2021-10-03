import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Statement from "../index";
import Goto from "./goto";
const PARSER = U.arg1R1(E.form[""]);
export default class TryGotoForm extends Statement {
    static parse(raw) {
        const target = PARSER.tryParse(raw);
        return new TryGotoForm(target);
    }
    target;
    constructor(target) {
        super();
        this.target = target;
    }
    *run(vm) {
        const target = this.target.reduce(vm).toUpperCase();
        const context = vm.context();
        if (context.fn.thunk.labelMap.has(target)) {
            return yield* new Goto(target).run(vm);
        }
        return null;
    }
}
