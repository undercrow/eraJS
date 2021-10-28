import Slice from "../../slice";
import Statement from "../index";
export default class Restart extends Statement {
    constructor(raw: Slice);
    run(): AsyncGenerator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
