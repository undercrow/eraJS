import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class DrawLine extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run() {
        yield { type: "line" };
        return null;
    }
}
