import { assertNumber, assertString } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class SaveData extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [indexExpr, commentExpr] = this.arg.get();
        const index = indexExpr.reduce(vm);
        assertNumber(index, "1st argument of SAVEDATA must be a number");
        const comment = commentExpr.reduce(vm);
        assertString(comment, "2nd argument of SAVEDATA must be a string");
        throw new Error("SAVEDATA is not implemented yet!");
        return null;
    }
}
