import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R1(U.charSeq());
export default class CustomDrawLine extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
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
