import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R0(E.form[""]).map((form) => form ?? new Form([{ value: "" }]));
export default class PrintForm extends Statement {
    postfix;
    value;
    constructor(instruction, raw) {
        super();
        this.postfix = instruction.replace(/^PRINTFORM/, "");
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield* Print.print(vm, this.value.get().reduce(vm));
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
