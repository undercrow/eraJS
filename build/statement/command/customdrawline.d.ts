import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";
export default class CustomDrawLine extends Statement {
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(): Generator<{
        readonly type: "line";
        readonly value: string;
    }, null, unknown>;
}
