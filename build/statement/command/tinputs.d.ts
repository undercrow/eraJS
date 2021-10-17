import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import type VM from "../../vm";
import Statement from "../index";
export default class TInputS extends Statement {
    arg: Lazy<[Expr, Expr, Expr | undefined, string | undefined]>;
    constructor(raw: Slice);
    run(vm: VM): ReturnType<Statement["run"]>;
}
