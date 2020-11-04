import * as color from "../../color";
import type VM from "../../vm";

export default function getBgColor(vm: VM, _arg: Array<string | number>): number {
	return color.toHex(vm.color.back);
}
