import type VM from "../../vm";
import type Expr from "../expr";
export default function rand(vm: VM, arg: Expr[]): Promise<number>;
