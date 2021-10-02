import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";

export default function findLastChara(vm: VM, arg: Expr[]): number {
	const target = arg[0];
	assert(target instanceof Variable, "1st argument of FINDLASTCHARA should be a variable");
	const value = arg[1].reduce(vm);
	const start = arg.length >= 3 ? arg[2].reduce(vm) : 0;
	assertNumber(start, "3rd argument of FINDLASTCHARA should be a number");
	const end = arg.length >= 4 ? arg[3].reduce(vm) : vm.characterList.length;
	assertNumber(end, "4th argument of FINDLASTCHARA should be a number");

	const index = target.reduceIndex(vm);
	for (let i = end - 1; i >= start; --i) {
		if (target.getCell(vm).get(vm, [i, ...index]) === value) {
			return i;
		}
	}

	return -1;
}
