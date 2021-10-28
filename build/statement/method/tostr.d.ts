import type VM from "../../vm";
import type Expr from "../expr";
export default function toStr(vm: VM, arg: Expr[]): Promise<string>;
