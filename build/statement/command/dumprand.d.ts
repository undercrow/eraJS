import type VM from "../../vm";
import Slice from "../../slice";
import Statement from "../index";
export default class DumpRand extends Statement {
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
