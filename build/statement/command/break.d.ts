import Slice from "../../slice";
import Statement from "../index";
export default class Break extends Statement {
    constructor(raw: Slice);
    run(): AsyncGenerator<never, {
        readonly type: "break";
    }, unknown>;
}
