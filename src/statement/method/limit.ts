import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function limit(vm: VM, arg: Expr[]): number {
	const value = arg[0].reduce(vm);
	assertNumber(value, "1st argument of LIMIT must a be number");
	const min = arg[1].reduce(vm);
	assertNumber(min, "2nd argument of LIMIT must a be number");
	const max = arg[2].reduce(vm);
	assertNumber(max, "3rd argument of LIMIT must a be number");

	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	} else {
		return value;
	}
}
