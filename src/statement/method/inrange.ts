import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function inRange(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.number(value, "1st argument of INRANGE should be a number");
	const min = await arg[1].reduce(vm);
	assert.number(min, "2nd argument of INRANGE should be a number");
	const max = await arg[2].reduce(vm);
	assert.number(max, "3rd argument of INRANGE should be a number");

	return min <= value && value <= max ? 1 : 0;
}
