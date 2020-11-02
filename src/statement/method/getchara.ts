import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function getChara(vm: VM, arg: Array<string | number>): number {
	const id = arg[0];
	assertNumber(id, "1st argument of GETCHARA should be an integer");

	const charaNum = vm.getValue("CHARANUM");
	for (let i = 0; i < charaNum; ++i) {
		if (vm.getValue("NO", i) === id) {
			return i;
		}
	}
	return -1;
}
