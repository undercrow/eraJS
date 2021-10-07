import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class ClearLine extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const count = this.arg.get().reduce(vm);
        assertNumber(count, "Argument of CLEARLINE must be an integer!");
        yield { type: "clearline", count };
        const lineCount = vm.getValue("LINECOUNT").get(vm, [0]);
        vm.getValue("LINECOUNT").set(vm, lineCount - count, []);
        return null;
    }
}
