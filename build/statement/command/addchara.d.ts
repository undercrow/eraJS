import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";
export default class AddChara extends Statement {
    characters: Lazy<Expr[]>;
    constructor(raw: string);
    run(vm: VM): Generator<never, null, unknown>;
}
