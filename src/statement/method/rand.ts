import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function rand(_vm: VM, arg: Array<string | number>): number {
	const min = arg[0] ?? 0;
	assertNumber(min, "1st argument of RAND should be an integer");
	const max = arg[1] ?? ((2 ** 32) - 1);
	assertNumber(max, "2nd argument of RAND should be an integer");

	return Math.floor(Math.random() * (max - min)) + min;
}
