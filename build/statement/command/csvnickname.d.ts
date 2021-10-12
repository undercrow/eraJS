import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class CsvNickname extends Statement {
    arg: Lazy<[Expr, Expr | undefined]>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
