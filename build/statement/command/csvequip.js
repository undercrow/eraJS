import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class CsvEquip extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(_vm) {
        throw new Error("CSVEQUIP is not implemented yet!");
        return null;
    }
}
