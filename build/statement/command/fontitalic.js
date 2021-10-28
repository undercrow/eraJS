import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class FontItalic extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        vm.font.italic = !vm.font.italic;
        return null;
    }
}
