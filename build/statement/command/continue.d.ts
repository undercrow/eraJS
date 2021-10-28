import Slice from "../../slice";
import Statement from "../index";
export default class Continue extends Statement {
    constructor(raw: Slice);
    run(): AsyncGenerator<never, {
        readonly type: "continue";
    }, unknown>;
}
