import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class DelData extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const index = this.arg.get().reduce(vm);
        assert.number(index, "Argument of DELDATA must be a number");
        throw new Error("DELDATA is not implemented yet!");
        return null;
    }
}
