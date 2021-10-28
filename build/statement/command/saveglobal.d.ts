import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export declare const whitelist: string[];
export default class SaveGlobal extends Statement {
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
