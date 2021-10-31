import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.expr, X.expr);
export default class PrintButton extends Statement {
    align;
    arg;
    constructor(raw, align) {
        super(raw);
        this.align = align;
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [textExpr, valueExpr] = this.arg.get();
        const text = await textExpr.reduce(vm);
        assert.string(text, "1st argument of PRINTBUTTON must be a string");
        const value = await valueExpr.reduce(vm);
        yield* vm.printer.button(text, typeof value === "string" ? value : value.toString(), this.align);
        return null;
    }
}
