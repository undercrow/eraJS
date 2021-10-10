import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Const from "../expr/const";
import Statement from "../index";
import Print from "./print";
const DATA = /^DATA(\s+|$)/i;
const DATAFORM = /^DATAFORM\s+/i;
const DATAFORM_EMPTY = /^DATAFORM$/i;
const DATALIST = /^DATALIST$/i;
const ENDLIST = /^ENDLIST$/i;
const ENDDATA = /^ENDDATA$/i;
const PARSER_CONST = U.arg1R0(U.charSeq());
const PARSER_FORM = U.arg1R1(E.form[""]);
export default class PrintData extends Statement {
    static parse(postfix, lines, from) {
        let index = from + 1;
        const data = [];
        while (true) {
            if (lines.length <= index) {
                throw new Error("Unexpected end of thunk!");
            }
            const current = lines[index];
            index += 1;
            if (DATA.test(current)) {
                data.push(new Const(PARSER_CONST.tryParse(current.slice("DATA".length)) ?? ""));
            }
            else if (DATAFORM.test(current)) {
                data.push(PARSER_FORM.tryParse(current.slice("DATAFORM".length)));
            }
            else if (DATAFORM_EMPTY.test(current)) {
                data.push(new Const(""));
            }
            else if (DATALIST.test(current) || ENDLIST.test(current)) {
                // Do nothing
            }
            else if (ENDDATA.test(current)) {
                return [new PrintData(postfix, data), index - from];
            }
            else {
                throw new Error("Unexpected statement found while parsing PRINTDATA statement");
            }
        }
    }
    postfix;
    data;
    constructor(postfix, data) {
        super();
        this.postfix = postfix;
        this.data = data;
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const index = vm.random.next() % this.data.length;
        const value = this.data[index].reduce(vm);
        assert.string(value, "Item of PRINTDATA must be a string");
        yield* vm.print(value);
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}