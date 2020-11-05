import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function max(_vm: VM, arg: Array<string | number>): number {
	assert(arg.length > 0, "MAX must have at least 1 argument");
	arg.forEach((a, i) => assertNumber(a, `${i + 1}th argument of MAX must be a number`));

	return Math.max(...arg as number[]);
}
