import Slice from "../../slice";
import Statement from "../index";
export default class Quit extends Statement {
    constructor(raw: Slice);
    run(): AsyncGenerator<never, {
        readonly type: "quit";
    }, unknown>;
}
