import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function sqrt(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.number(value, "1st argument of sqrt must be a number");

	return Math.floor(Math.sqrt(value));
}
