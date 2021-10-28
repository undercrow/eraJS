import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.sepBy0(",", X.expr);
export default class AssignStr extends Statement {
    dest;
    arg;
    constructor(dest, raw) {
        super(raw);
        this.dest = dest;
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const dest = this.dest.getCell(vm);
        const index = await this.dest.reduceIndex(vm);
        const arg = this.arg.get();
        const partialIndex = index.slice(0, -1);
        const lastIndex = index[index.length - 1] ?? 0;
        for (let i = 0; i < arg.length; ++i) {
            const value = await arg[i].reduce(vm);
            dest.set(vm, value, [...partialIndex, lastIndex + i]);
        }
        return null;
    }
}
