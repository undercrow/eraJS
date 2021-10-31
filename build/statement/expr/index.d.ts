import type { Leaf } from "../../value";
import type VM from "../../vm";
export default interface Expr {
    reduce: (vm: VM) => Promise<Leaf>;
}
