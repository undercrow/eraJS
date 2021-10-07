import P from "parsimmon";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";
const PARSER = U.argNR0(P.alt(P.string("'").then(U.charSeq(",").map((str) => new Const(str))), E.expr));
export default class PrintV extends Statement {
    postfix;
    value;
    constructor(instruction, raw) {
        super();
        this.postfix = instruction.replace(/^PRINTV/, "");
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        let text = "";
        for (const value of this.value.get()) {
            text += value.reduce(vm).toString();
        }
        yield* vm.print(text);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
