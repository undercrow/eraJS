import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg2R2(X.variable, C.Float);
export default class Times extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [dest, value] = this.arg.get();
        const original = await dest.reduce(vm);
        assert.bigint(original, "1st argument of TIMES must be a number");
        const index = await dest.reduceIndex(vm);
        let result = 0n;
        let remaining = value;
        for (let i = 0; i < 100; ++i) {
            if (remaining === 0) {
                break;
            }
            const high = Math.floor(remaining);
            result += original * BigInt(high) / (100n ** BigInt(i));
            remaining = (remaining - high) * 100;
        }
        dest.getCell(vm).set(vm, result, index);
        return null;
    }
}
