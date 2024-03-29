import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function barStr(vm: VM, arg: Expr[]): Promise<string> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st argument of BAR must be a number");
	const max = await arg[1].reduce(vm);
	assert.bigint(max, "2nd argument of BAR must be a number");
	const length = await arg[2].reduce(vm);
	assert.bigint(length, "3rd argument of BAR must be a number");

	const filled = length * value / max;
	return "[" + "*".repeat(Number(filled)) + ".".repeat(Number(length - filled)) + "]";
}
