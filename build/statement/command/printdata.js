import * as assert from "../../assert";
import * as EM from "../../error";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";
const DATA = /^DATA(\s+|$)/i;
const DATAFORM = /^DATAFORM\s+/i;
const DATAFORM_EMPTY = /^DATAFORM$/i;
const DATALIST = /^DATALIST$/i;
const ENDLIST = /^ENDLIST$/i;
const ENDDATA = /^ENDDATA$/i;
const PARSER_CONST = U.arg1R0(U.charSeq()).map((value) => new Const(value ?? ""));
const PARSER_FORM = U.arg1R1(E.form[""]);
export default class PrintData extends Statement {
    static parse(postfix, lines, from) {
        let index = from + 1;
        const data = [];
        while (true) {
            if (lines.length <= index) {
                throw EM.parser("Unexpected end of thunk in PRINTDATA expression");
            }
            const current = lines[index];
            index += 1;
            if (DATA.test(current.content)) {
                data.push(new Lazy(current.slice("DATA".length), PARSER_CONST));
            }
            else if (DATAFORM.test(current.content)) {
                data.push(new Lazy(current.slice("DATAFORM".length), PARSER_FORM));
            }
            else if (DATAFORM_EMPTY.test(current.content)) {
                // TODO: Refactor this part
                data.push(new Lazy(current.slice("DATAFORM".length), PARSER_CONST));
            }
            else if (DATALIST.test(current.content) || ENDLIST.test(current.content)) {
                // Do nothing
            }
            else if (ENDDATA.test(current.content)) {
                return [new PrintData(lines[from], postfix, data), index - from];
            }
            else {
                throw EM.parser("Unexpected statement in PRINTDATA expression");
            }
        }
    }
    postfix;
    data;
    constructor(raw, postfix, data) {
        super(raw);
        this.postfix = postfix;
        this.data = data;
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const index = vm.random.next() % this.data.length;
        const value = this.data[index].get().reduce(vm);
        assert.string(value, "Item of PRINTDATA must be a string");
        yield* vm.print(value);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
