import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function min(_vm: VM, arg: Array<string | number>): number {
	assert(arg.length > 0, "MIN must have at least 1 argument");
	arg.forEach((a, i) => assertNumber(a, `${i + 1}th argument of MIN must be a number`));

	return Math.min(...arg as number[]);
}
