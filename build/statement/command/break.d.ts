import Slice from "../../slice";
import Statement from "../index";
export default class Break extends Statement {
    constructor(raw: Slice);
    run(): Generator<never, {
        readonly type: "break";
    }, unknown>;
}
