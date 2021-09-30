import {assertString} from "../../assert";
import type VM from "../../vm";

export default function toInt(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertString(value, "1st Argument of TOINT should be a string");

	const result = Number(value);
	return isNaN(result) ? 0 : result;
}
