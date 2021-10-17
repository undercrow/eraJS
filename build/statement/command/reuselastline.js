import * as assert from "../../assert";
import * as EM from "../../error";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(E.form[""]);
export default class ReuseLastLine extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const value = this.arg.get()?.reduce(vm) ?? "";
        assert.string(value, "Argument of REUSELASTLINE must be a string");
        throw EM.notImpl("REUSELASTLINE");
        return null;
    }
}
