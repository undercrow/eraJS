import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R0(E.form[""]).map((form) => form ?? new Form([{ value: "" }]));
export default class PrintFormC extends Statement {
    align;
    postfix;
    arg;
    constructor(align, postfix, raw) {
        super(raw);
        this.align = align;
        this.postfix = postfix;
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield* vm.print(this.arg.get().reduce(vm), this.align);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
