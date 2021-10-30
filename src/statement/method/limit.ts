import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function limit(vm: VM, arg: Expr[]): Promise<bigint> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st argument of LIMIT must a be number");
	const min = await arg[1].reduce(vm);
	assert.bigint(min, "2nd argument of LIMIT must a be number");
	const max = await arg[2].reduce(vm);
	assert.bigint(max, "3rd argument of LIMIT must a be number");

	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	} else {
		return value;
	}
}
