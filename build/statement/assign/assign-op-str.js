import * as assert from "../../assert";
import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import Statement from "../index";
const PARSER = X.expr;
export default class AssignOpStr extends Statement {
    dest;
    operator;
    arg;
    constructor(dest, operator, raw) {
        super(raw);
        this.dest = dest;
        this.operator = operator;
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const dest = this.dest.getCell(vm);
        const index = await this.dest.reduceIndex(vm);
        const original = dest.get(vm, index);
        const arg = await this.arg.get().reduce(vm);
        assert.string(arg, `Right operand of ${this.operator} should be a string`);
        switch (this.operator) {
            case "+=":
                dest.set(vm, original + arg, index);
                break;
        }
        return null;
    }
}
