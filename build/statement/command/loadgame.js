import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class LoadGame extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run() {
        return {
            type: "begin",
            keyword: "LOADGAME",
        };
    }
}
