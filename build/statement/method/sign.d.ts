import type VM from "../../vm";
import type Expr from "../expr";
export default function sign(vm: VM, arg: Expr[]): Promise<number>;
