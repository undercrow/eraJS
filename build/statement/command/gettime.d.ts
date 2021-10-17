import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class GetTime extends Statement {
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
