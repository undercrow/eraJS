import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class OutputLog extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run() {
        throw new Error("OUTPUTLOG is not implemented yet!");
        return null;
    }
}