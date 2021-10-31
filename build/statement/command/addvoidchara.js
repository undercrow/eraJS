import * as E from "../../error";
import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class AddVoidChara extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run() {
        throw E.notImpl("ADDVOIDCHARA");
        return null;
    }
}
