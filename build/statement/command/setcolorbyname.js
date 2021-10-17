import * as EM from "../../error";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(U.charSeq());
export default class SetColorByName extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(_vm) {
        throw EM.notImpl("SETCOLORBYNAME");
        return null;
    }
}
