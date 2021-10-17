import Slice from "../../slice";
import Statement from "../index";
export default class DrawLine extends Statement {
    constructor(raw: Slice);
    run(): Generator<{
        readonly type: "line";
    }, null, unknown>;
}
