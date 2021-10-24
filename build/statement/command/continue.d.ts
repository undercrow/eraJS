import Slice from "../../slice";
import Statement from "../index";
export default class Continue extends Statement {
    constructor(raw: Slice);
    run(): Generator<never, {
        readonly type: "continue";
    }, unknown>;
}
