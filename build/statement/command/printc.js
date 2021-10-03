import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R0(U.charSeq()).map((str) => str ?? "");
export default class PrintC extends Statement {
    align;
    postfix;
    value;
    constructor(align, postfix, raw) {
        super();
        this.align = align;
        this.postfix = postfix;
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield {
            type: "string",
            text: this.value.get(),
            cell: this.align,
        };
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
