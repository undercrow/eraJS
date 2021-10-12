import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(U.charSeq());
export default class CustomDrawLine extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run() {
        const value = this.arg.get();
        yield {
            type: "line",
            value,
        };
        return null;
    }
}
