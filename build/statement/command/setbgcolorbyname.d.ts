import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class SetBgColorByName extends Statement {
    arg: Lazy<string>;
    constructor(raw: string);
    run(_vm: VM): Generator<never, null, unknown>;
}
