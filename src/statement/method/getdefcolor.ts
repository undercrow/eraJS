import * as color from "../../color";
import type VM from "../../vm";

export default function getDefColor(vm: VM, _arg: Array<string | number>): number {
	return color.toHex(vm.color.defaultFront);
}
