import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function toStr(_vm: VM, arg: Array<string | number>): string {
	const value = arg[0];
	assertNumber(value, "1st Argument of TOSTR should be a number");

	return value.toString();
}
