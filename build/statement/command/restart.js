import * as U from "../../parser/util";
import Fn from "../../fn";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class Restart extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run() {
        return {
            type: "goto",
            label: Fn.START_OF_FN,
        };
    }
}
