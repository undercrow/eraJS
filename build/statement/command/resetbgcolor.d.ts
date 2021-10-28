import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class ResetBgColor extends Statement {
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
