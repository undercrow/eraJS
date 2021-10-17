import * as EM from "../../error";
import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class CurrentAlign extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run() {
        throw EM.notImpl("CURRENTALIGN");
        return null;
    }
}
