import {assertNumber} from "../../assert";
import type VM from "../../vm";

export default function sign(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertNumber(value, "1st argument of SIGN must a be number");

	return Math.sign(value);
}
