import {assertNumber, assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function varSize(vm: VM, arg: Expr[]): number {
	const name = arg[0].reduce(vm);
	assertString(name, "1st Argument of VARSIZE should be a string");

	const depth = arg.length >= 2 ? arg[1].reduce(vm) : 0;
	assertNumber(depth, "2nd argument of VARSIZE must be a number");
	return vm.getValue(name).length(depth);
}
