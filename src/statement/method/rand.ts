import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function rand(_vm: VM, arg: Array<string | number>): number {
	if (arg.length === 0) {
		assert(false, "RAND should have at least 1 argument");
	} else if (arg.length === 1) {
		const max = arg[0];
		assertNumber(max, "1st argument of RAND should be an integer");
		return Math.floor(Math.random() * max);
	} else {
		const min = arg[0];
		assertNumber(min, "1st argument of RAND should be an integer");
		const max = arg[1];
		assertNumber(max, "2nd argument of RAND should be an integer");

		return Math.floor(Math.random() * (max - min)) + min;
	}
}
