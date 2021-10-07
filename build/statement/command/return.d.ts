import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Return extends Statement {
    expr: Lazy<Expr[]>;
    constructor(raw: string);
    run(vm: VM): Generator<never, {
        readonly type: "return";
        readonly value: (string | number)[];
    }, unknown>;
}
