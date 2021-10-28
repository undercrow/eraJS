import type VM from "../../vm";
import type Expr from "../expr";
export default function getBit(vm: VM, arg: Expr[]): Promise<number>;
