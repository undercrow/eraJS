import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class TryGoto extends Statement {
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    } | null, unknown>;
}
