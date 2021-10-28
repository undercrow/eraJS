import type VM from "../../vm";
import type Expr from "../expr";
export default function match(vm: VM, arg: Expr[]): Promise<number>;
