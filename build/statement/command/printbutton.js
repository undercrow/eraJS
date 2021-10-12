import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(E.expr, E.expr);
export default class PrintButton extends Statement {
    align;
    arg;
    constructor(arg, align) {
        super();
        this.align = align;
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [textExpr, valueExpr] = this.arg.get();
        const text = textExpr.reduce(vm);
        assert.string(text, "1st argument of PRINTBUTTON must be a string");
        const value = valueExpr.reduce(vm);
        yield {
            type: "button",
            text,
            value: typeof value === "string" ? value : value.toString(),
            cell: this.align,
        };
        return null;
    }
}
