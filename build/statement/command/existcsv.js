import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class ExistCSV extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const id = this.arg.get().reduce(vm);
        assertNumber(id, "Argument of EXISTCSV must be an integer!");
        const result = vm.templateMap.has(id) ? 1 : 0;
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
