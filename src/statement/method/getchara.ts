import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function getChara(vm: VM, arg: Array<string | number>): number {
	const id = arg[0];
	assertNumber(id, "1st argument of GETCHARA should be an integer");

	for (let i = 0; i < vm.characters.length; ++i) {
		if (vm.characters[i].id === id) {
			return i;
		}
	}
	return -1;
}
