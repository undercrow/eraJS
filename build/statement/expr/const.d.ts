import type { Leaf } from "../../value";
import type VM from "../../vm";
import type Expr from "./index";
export default class Const implements Expr {
    value: Leaf;
    constructor(value: Const["value"]);
    reduce(_vm: VM): Promise<Leaf>;
}
