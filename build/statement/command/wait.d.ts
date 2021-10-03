import type VM from "../../vm";
import Statement from "../index";
export default class Wait extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<{
        readonly type: "wait";
    }, null, unknown>;
}
