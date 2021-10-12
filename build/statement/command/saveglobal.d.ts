import type VM from "../../vm";
import Statement from "../index";
export declare const savedVariables: string[];
export default class SaveGlobal extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
