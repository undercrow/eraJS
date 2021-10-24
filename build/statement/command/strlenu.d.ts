import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class StrLen extends Statement {
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
