import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.form[""]);
export default class PutForm extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const value = await this.arg.get().reduce(vm);
        assert.string(value, "1st argument of PUTFORM should be a number");
        const cell = vm.getValue("SAVEDATA_TEXT");
        cell.set(vm, cell.get(vm, []) + value, []);
        return null;
    }
}
