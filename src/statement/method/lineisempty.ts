import type VM from "../../vm";
import type Expr from "../expr";

export default function lineIsEmpty(vm: VM, _arg: Expr[]): number {
	return vm.queue.isLineEmpty ? 1 : 0;
}
