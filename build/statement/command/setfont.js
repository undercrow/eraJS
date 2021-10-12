import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(E.expr);
export default class SetFont extends Statement {
    font;
    constructor(arg) {
        super();
        this.font = new Lazy(arg, PARSER);
    }
    *run(vm) {
        // TODO: use default font
        const font = this.font.get()?.reduce(vm) ?? "";
        assert.string(font, "Argument of SETFONT must be a string");
        vm.font.name = font;
        return null;
    }
}
