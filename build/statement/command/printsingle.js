import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
const PARSER = U.arg1R0(U.charSeq()).map((str) => str ?? "");
export default class PrintSingle extends Statement {
    postfix;
    arg;
    constructor(postfix, raw) {
        super();
        this.postfix = postfix;
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield* vm.printSingle(this.arg.get());
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
