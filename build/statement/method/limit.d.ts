import type VM from "../../vm";
import type Expr from "../expr";
export default function limit(vm: VM, arg: Expr[]): Promise<bigint>;
