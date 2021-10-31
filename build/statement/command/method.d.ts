import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class Method extends Statement {
    name: string;
    arg: Lazy<Expr[]>;
    constructor(name: string, raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
