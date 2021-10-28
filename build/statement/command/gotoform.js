import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.form[""]);
export default class GotoForm extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const arg = await this.arg.get().reduce(vm);
        const target = arg.toUpperCase();
        const context = vm.context();
        if (!context.fn.thunk.labelMap.has(target)) {
            throw E.notFound("Label", target);
        }
        return {
            type: "goto",
            label: target,
        };
    }
}
