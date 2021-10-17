import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class SetColorByName extends Statement {
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(_vm: VM): Generator<never, null, unknown>;
}
