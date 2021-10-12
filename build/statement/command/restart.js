import * as U from "../../erb/util";
import Fn from "../../fn";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class Restart extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run() {
        return {
            type: "goto",
            label: Fn.START_OF_FN,
        };
    }
}
