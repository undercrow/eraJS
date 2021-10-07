import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R1(E.variable, U.alt("FORWARD", "BACK"));
export default class SortChara extends Statement {
    value;
    constructor(raw) {
        super();
        this.value = new Lazy(raw, PARSER);
    }
    *run(_vm) {
        throw new Error("SORTCHARA is not implemented yet!");
        return null;
    }
}
