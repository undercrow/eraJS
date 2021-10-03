import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class StrLen extends Statement {
    value: Lazy<string>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
