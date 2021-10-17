import P from "parsimmon";
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
    *run(vm) {
        this.raw.get();
        const dest = this.dest.getCell(vm);
        const index = this.dest.reduceIndex(vm);
        const original = dest.get(vm, index);
        switch (this.operator) {
            case "++":
                dest.set(vm, original + 1, index);
                break;
            case "--":
                dest.set(vm, original - 1, index);
                break;
        }
        return null;
    }
}
