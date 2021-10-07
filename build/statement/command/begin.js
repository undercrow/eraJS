import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg1R1(U.Identifier);
export default class Begin extends Statement {
    target;
    constructor(arg) {
        super();
        this.target = PARSER.tryParse(arg);
    }
    *run() {
        return {
            type: "begin",
            keyword: this.target,
        };
    }
}
