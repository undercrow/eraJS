import Lazy from "../../lazy";
import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT"));
export default class Alignment extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        vm.alignment = this.arg.get();
        return null;
    }
}
