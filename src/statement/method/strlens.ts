import {assertString} from "../../assert";
import type VM from "../../vm";

export default function strLenS(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertString(value, "1st Argument of STRLENS should be a string");

	return value.length;
}
