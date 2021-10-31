import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(X.form[""]);
export default class EncodeToUni extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const value = await this.arg.get().reduce(vm);
        assert.string(value, "1st argument of ENCODETOUNI must be a string");
        const buffer = Buffer.from(value, "utf8");
        vm.getValue("RESULT").set(vm, BigInt(buffer.byteLength), [0]);
        for (let i = 0; i < buffer.byteLength; ++i) {
            vm.getValue("RESULT").set(vm, BigInt(buffer[i]), [i + 1]);
        }
        return null;
    }
}
