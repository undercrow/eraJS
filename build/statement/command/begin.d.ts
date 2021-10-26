import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";
export default class Begin extends Statement {
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(): Generator<never, {
        readonly type: "begin";
        readonly keyword: string;
    }, unknown>;
}
