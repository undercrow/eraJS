import Lazy from "../../lazy";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement from "../index";
export default class TOneInput extends Statement {
    arg: Lazy<[Expr, Expr, Expr | undefined, string | undefined]>;
    constructor(raw: string);
    run(vm: VM): ReturnType<Statement["run"]>;
}
