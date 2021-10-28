import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function abs(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.number(value, "1st argument of ABS must a be number");

	return Math.abs(value);
}
