import type VM from "../../vm";
import type Expr from "../expr";

export default function getDefColor(vm: VM, _arg: Expr[]): number {
	return parseInt(vm.printer.defaultColor, 16);
}
