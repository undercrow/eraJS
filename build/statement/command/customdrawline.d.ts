import Lazy from "../../lazy";
import Statement from "../index";
export default class CustomDrawLine extends Statement {
    arg: Lazy<string>;
    constructor(arg: string);
    run(): Generator<{
        readonly type: "line";
        readonly value: string;
    }, null, unknown>;
}
