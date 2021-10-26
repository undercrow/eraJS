import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class SaveGame extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run() {
        return {
            type: "begin",
            keyword: "SAVEGAME",
        };
    }
}
