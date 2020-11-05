import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function abs(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertNumber(value, "1st argument of ABS must a be number");

	return Math.abs(value);
}
