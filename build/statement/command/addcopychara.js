import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class AddCopyChara extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run() {
        throw E.notImpl("ADDCOPYCHARA");
        return null;
    }
}
