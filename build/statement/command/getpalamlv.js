import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class GetPalamLv extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const [valExpr, maxExpr] = this.arg.get();
        const value = valExpr.reduce(vm);
        assertNumber(value, "1st argument of GETPALAMLV must be a number");
        const max = maxExpr.reduce(vm);
        assertNumber(max, "2nd argument of GETPALAMLV must be a number");
        let result = max;
        for (let i = 0; i <= max; ++i) {
            if (value < vm.getValue("PALAMLV").get(vm, [i])) {
                result = i - 1;
                break;
            }
        }
        vm.getValue("RESULT").set(vm, result, [0]);
        return null;
    }
}
