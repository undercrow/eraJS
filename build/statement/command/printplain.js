import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Const from "../expr/const";
import Statement from "../index";
const PARSER_CONST = U.arg1R0(U.charSeq()).map((str) => new Const(str ?? ""));
const PARSER_FORM = U.arg1R0(E.form[""]).map((form) => form ?? new Const(""));
export default class PrintPlain extends Statement {
    arg;
    constructor(postfix, raw) {
        super(raw);
        switch (postfix) {
            case null: {
                this.arg = new Lazy(raw, PARSER_CONST);
                break;
            }
            case "FORM": {
                this.arg = new Lazy(raw, PARSER_FORM);
            }
        }
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const text = this.arg.get().reduce(vm);
        assert.string(text, "1st argument of PRINTPLAIN must be a string");
        yield* vm.print(text);
        return null;
    }
}
