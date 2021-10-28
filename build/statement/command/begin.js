import Lazy from "../../lazy";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg1R1(C.Identifier);
export default class Begin extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async *run() {
        return {
            type: "begin",
            keyword: this.arg.get(),
        };
    }
}
