import Slice from "../../slice";
import Statement from "../index";
export default class ClearTextBox extends Statement {
    constructor(raw: Slice);
    run(): AsyncGenerator<never, null, unknown>;
}
