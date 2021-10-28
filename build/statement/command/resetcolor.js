import * as U from "../../parser/util";
import * as color from "../../color";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class ResetColor extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run(vm) {
        vm.color.front = color.copy(vm.color.defaultFront);
        return null;
    }
}
