import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export declare type Align = "LEFT" | "CENTER" | "RIGHT";
export default class Alignment extends Statement {
    arg: Lazy<Align>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
