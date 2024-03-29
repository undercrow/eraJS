import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

const LARGE_INT = 2n ** 60n;
export default async function min(vm: VM, arg: Expr[]): Promise<bigint> {
	assert.cond(arg.length > 0, "MIN must have at least 1 argument");
	let result = LARGE_INT;
	for (let i = 0; i < arg.length; ++i) {
		const value = await arg[i].reduce(vm);
		assert.bigint(value, `${i + 1}th argument of MIN must be a number`);
		result = result > value ? value : result;
	}
	return result;
}
