import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function rand(vm: VM, arg: Expr[]): number {
	if (arg.length === 0) {
		assert(false, "RAND should have at least 1 argument");
	} else if (arg.length === 1) {
		const max = arg[0].reduce(vm);
		assertNumber(max, "1st argument of RAND should be an integer");
		return vm.random.next() % max;
	} else {
		const min = arg[0].reduce(vm);
		assertNumber(min, "1st argument of RAND should be an integer");
		const max = arg[1].reduce(vm);
		assertNumber(max, "2nd argument of RAND should be an integer");

		return (vm.random.next() % (max - min)) + min;
	}
}
