import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function sign(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.number(value, "1st argument of SIGN must a be number");

	return Math.sign(value);
}
