import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class GetMillisecond extends Statement {
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
