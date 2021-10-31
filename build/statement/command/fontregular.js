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
        vm.printer.font.bold = false;
        vm.printer.font.italic = false;
        vm.printer.font.strike = false;
        vm.printer.font.underline = false;
        return null;
    }
}
