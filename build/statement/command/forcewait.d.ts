import Slice from "../../slice";
import Statement from "../index";
export default class ForceWait extends Statement {
    constructor(raw: Slice);
    run(): Generator<never, null, unknown>;
}
