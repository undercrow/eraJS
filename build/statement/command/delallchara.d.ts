import Slice from "../../slice";
import Statement from "../index";
export default class DelAllChara extends Statement {
    constructor(raw: Slice);
    run(): Generator<never, null, unknown>;
}
