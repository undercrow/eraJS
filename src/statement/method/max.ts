import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function max(vm: VM, arg: Expr[]): Promise<bigint> {
	assert.cond(arg.length > 0, "MAX must have at least 1 argument");
	let result = 0n;
	for (let i = 0; i < arg.length; ++i) {
		const value = await arg[i].reduce(vm);
		assert.bigint(value, `${i + 1}th argument of MAX should be a number`);
		result = result > value ? result : value;
	}

	return result;
}
