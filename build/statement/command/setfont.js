import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(X.expr);
export default class SetFont extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    *run(vm) {
        // TODO: use default font
        const font = this.arg.get()?.reduce(vm) ?? "";
        assert.string(font, "Argument of SETFONT must be a string");
        vm.font.name = font;
        return null;
    }
}
