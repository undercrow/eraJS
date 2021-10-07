import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(U.charSeq());
export default class SetBgColorByName extends Statement {
    arg;
    constructor(raw) {
        super();
        this.arg = new Lazy(raw, PARSER);
    }
    *run(_vm) {
        throw new Error("SETBGCOLORBYNAME is not implemented yet!");
        return null;
    }
}
