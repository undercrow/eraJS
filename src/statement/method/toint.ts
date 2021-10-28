import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function toInt(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.string(value, "1st Argument of TOINT should be a string");

	const result = Number(value);
	return isNaN(result) ? 0 : result;
}
