import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class FontBold extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        vm.font.bold = !vm.font.bold;
        return null;
    }
}
