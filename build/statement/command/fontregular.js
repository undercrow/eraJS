import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class FontRegular extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        vm.font.bold = false;
        vm.font.italic = false;
        vm.font.strike = false;
        vm.font.underline = false;
        return null;
    }
}
