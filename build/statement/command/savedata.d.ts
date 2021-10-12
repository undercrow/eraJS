import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export declare const savedVariables: string[];
export default class SaveData extends Statement {
    arg: Lazy<[Expr, Expr]>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
