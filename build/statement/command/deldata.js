import * as assert from "../../assert";
import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.expr);
export default class DelData extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const index = this.arg.get().reduce(vm);
        assert.number(index, "Argument of DELDATA must be a number");
        throw E.notImpl("DELDATA");
        return null;
    }
}
