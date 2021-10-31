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
    async *run(vm) {
        if (vm.printer.skipDisp) {
            return null;
        }
        const value = await this.arg.get().reduce(vm);
        yield* vm.printer.print(value, this.flags);
        return null;
    }
}
