import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function unicode(_vm: VM, arg: Array<string | number>): string {
	const value = arg[0];
	assertNumber(value, "1st Argument of UNICODE should be a number");

	return String.fromCharCode(value);
}
