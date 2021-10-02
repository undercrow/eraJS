import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";

export default function maxArray(vm: VM, arg: Expr[]): number {
	const target = arg[0];
	assert(target instanceof Variable, "1st argument of MAXARRAY should be a variable");
	assert(
		target.getCell(vm).type === "number",
		"1st argument of MAXARRAY should be a number variable",
	);
	const start = arg.length >= 2 ? arg[1].reduce(vm) : 0;
	assertNumber(start, "2nd argument of MAXARRAY should be a number");
	const end = arg.length >= 3 ? arg[2].reduce(vm) : Infinity;
	assertNumber(end, "3rd argument of MAXARRAY should be a number");

	let result = 0;
	for (let i = start; i < Math.min(end, target.getCell(vm).length(0)); ++i) {
		result = Math.max(result, target.getCell(vm).get(vm, [i]) as number);
	}

	return result;
}
