import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function barStr(_vm: VM, arg: Array<string | number>): string {
	const value = arg[0];
	assertNumber(value, "1st argument of BAR must be a number");
	const max = arg[1];
	assertNumber(max, "2nd argument of BAR must be a number");
	const length = arg[2];
	assertNumber(length, "3rd argument of BAR must be a number");

	const filled = Math.floor(length * (value / max));
	return "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]";
}
