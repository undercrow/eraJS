import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class InputS extends Statement {
    def: Lazy<string | undefined>;
    constructor(raw: string);
    run(vm: VM): Generator<{
        readonly type: "input";
    }, null, string>;
}
