import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class Print extends Statement {
    flags;
    value;
    constructor(flags, raw) {
        super(raw);
        this.flags = new Set(flags);
        this.value = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        if (vm.printer.skipDisp) {
            return null;
        }
        yield* vm.printer.print(this.value.get(), this.flags);
        return null;
    }
}
