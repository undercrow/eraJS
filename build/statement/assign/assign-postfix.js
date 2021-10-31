import P from "parsimmon";
import * as assert from "../../assert";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = P.eof;
export default class AssignPostfix extends Statement {
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
        this.raw.get();
        const dest = this.dest.getCell(vm);
        assert.cond(dest.type === "number", "++/-- should be used with a numeric variable");
        const index = await this.dest.reduceIndex(vm);
        const original = dest.get(vm, index);
        switch (this.operator) {
            case "++":
                dest.set(vm, original + 1n, index);
                break;
            case "--":
                dest.set(vm, original - 1n, index);
                break;
        }
        return null;
    }
}
