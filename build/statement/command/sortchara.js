import * as EM from "../../error";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R0(E.variable, U.alt("FORWARD", "BACK"));
export default class SortChara extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(_vm) {
        throw EM.notImpl("SORTCHARA");
        return null;
    }
}
