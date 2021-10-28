import type VM from "../../vm";
import type Expr from "../expr";
export default function barStr(vm: VM, arg: Expr[]): Promise<string>;
