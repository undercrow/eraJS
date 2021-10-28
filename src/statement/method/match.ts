import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";

export default async function match(vm: VM, arg: Expr[]): Promise<number> {
	const target = arg[0];
	assert.cond(target instanceof Variable, "1st argument of MATCH should be a variable");
	const value = await arg[1].reduce(vm);
	const start = arg.length >= 3 ? await arg[2].reduce(vm) : 0;
	assert.number(start, "3rd argument of MATCH should be a number");
	const end = arg.length >= 4 ? await arg[3].reduce(vm) : Infinity;
	assert.number(end, "4th argument of MATCH should be a number");

	let result = 0;
	for (let i = start; i < Math.min(end, target.getCell(vm).length(0)); ++i) {
		if (target.getCell(vm).get(vm, [i]) === value) {
			result += 1;
		}
	}

	return result;
}
