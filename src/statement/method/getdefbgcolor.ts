import type VM from "../../vm";
import type Expr from "../expr";

export default function getDefBgColor(vm: VM, _arg: Expr[]): number {
	return parseInt(vm.printer.defaultBackground, 16);
}
