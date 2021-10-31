import type VM from "../../vm";
import type Expr from "../expr";
export default function abs(vm: VM, arg: Expr[]): Promise<bigint>;
