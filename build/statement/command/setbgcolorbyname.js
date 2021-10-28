import * as E from "../../error";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(C.charSeq());
export default class SetBgColorByName extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(_vm) {
        throw E.notImpl("SETBGCOLORBYNAME");
        return null;
    }
}
