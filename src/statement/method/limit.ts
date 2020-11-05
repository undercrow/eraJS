import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function limit(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertNumber(value, "1st argument of LIMIT must a be number");
	const min = arg[1];
	assertNumber(min, "2nd argument of LIMIT must a be number");
	const max = arg[2];
	assertNumber(max, "3rd argument of LIMIT must a be number");

	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	} else {
		return value;
	}
}
