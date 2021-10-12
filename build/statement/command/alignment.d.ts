import type VM from "../../vm";
import Statement from "../index";
export declare type Align = "LEFT" | "CENTER" | "RIGHT";
export default class Alignment extends Statement {
    align: Align;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
