import type VM from "../../vm";
export default interface Expr {
    reduce: (vm: VM) => string | number;
}
