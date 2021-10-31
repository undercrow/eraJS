import Lazy from "../../lazy";
import Slice from "../../slice";
import type { Leaf } from "../../value";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Return extends Statement {
    arg: Lazy<Expr[]>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, {
        readonly type: "return";
        readonly value: Leaf[];
    }, unknown>;
}
