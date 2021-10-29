import type VM from "../../vm";
import type Expr from "../expr";

export default function lineIsEmpty(vm: VM, _arg: Expr[]): number {
	return vm.printer.chunks.length === 0 ? 1 : 0;
}
