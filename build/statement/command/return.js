import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(X.expr);
export default class Return extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const result = [];
        for (const expr of this.arg.get()) {
            result.push(await expr.reduce(vm));
        }
        return {
            type: "return",
            value: result,
        };
    }
}
