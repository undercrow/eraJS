import {assertNumber, assertString} from "../../assert";
import type VM from "../../vm";

export default function varSize(vm: VM, arg: Array<string | number>): number {
	const name = arg[0];
	assertString(name, "1st Argument of VARSIZE should be a string");

	const depth = arg[1] ?? 0;
	assertNumber(depth, "2nd argument of VARSIZE must be a number");
	return vm.getValue(name).length(depth);
}
