import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class PrintC extends Statement {
    align;
    flags;
    value;
    constructor(align, flags, raw) {
        super(raw);
        this.align = align;
        this.flags = new Set(flags);
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.queue.skipDisp) {
            return null;
        }
        const value = this.value.get();
        yield* vm.queue.print(value, this.flags, this.align);
        return null;
    }
}
