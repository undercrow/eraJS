import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.form[""]);
export default class GotoForm extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const target = this.arg.get().reduce(vm).toUpperCase();
        const context = vm.context();
        if (!context.fn.thunk.labelMap.has(target)) {
            throw new Error(`Label ${target} does not exist`);
        }
        return {
            type: "goto",
            label: target,
        };
    }
}
