import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Form from "../expr/form";
import Statement from "../index";
const PARSER = U.arg1R0(X.form[""]).map((form) => form ?? new Form([{ value: "" }]));
export default class PrintForm extends Statement {
    flags;
    arg;
    constructor(flags, raw) {
        super(raw);
        this.flags = new Set(flags);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.queue.skipDisp) {
            return null;
        }
        const value = this.arg.get().reduce(vm);
        yield* vm.queue.print(value, this.flags);
        return null;
    }
}
