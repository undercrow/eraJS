import type VM from "../../vm";
import Statement from "../index";
export default class GetMillisecond extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
