import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class IsActive extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run() {
        throw new Error("ISACTIVE is not implemented yet!");
        return null;
    }
}
