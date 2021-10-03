import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class Input extends Statement {
    def: Lazy<number | undefined>;
    constructor(raw: string);
    run(vm: VM): Generator<{
        readonly type: "input";
    }, null, string>;
}
