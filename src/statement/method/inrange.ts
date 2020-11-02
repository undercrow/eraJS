import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function inRange(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertNumber(value, "1st argument of INRANGE should be a number");
	const min = arg[1];
	assertNumber(min, "2nd argument of INRANGE should be a number");
	const max = arg[2];
	assertNumber(max, "3rd argument of INRANGE should be a number");

	return min <= value && value <= max ? 1 : 0;
}
