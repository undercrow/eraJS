import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R0(E.form[""]).map((form) => form ?? new Form([{ value: "" }]));
export default class PrintSingleForm extends Statement {
    postfix;
    arg;
    constructor(postfix, raw) {
        super(raw);
        this.postfix = postfix;
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield* vm.print(this.arg.get().reduce(vm));
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
