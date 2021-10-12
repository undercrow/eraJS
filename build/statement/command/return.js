import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(E.expr);
export default class Return extends Statement {
    expr;
    constructor(raw) {
        super();
        this.expr = new Lazy(raw, PARSER);
    }
    *run(vm) {
        return {
            type: "return",
            value: this.expr.get().map((e) => e.reduce(vm)),
        };
    }
}
