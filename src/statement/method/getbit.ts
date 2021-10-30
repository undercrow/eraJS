import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function getBit(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st argument of GETBIT should be a number");
	const index = await arg[1].reduce(vm);
	assert.bigint(index, "2nd argument of GETBIT should be a number");
	assert.cond(index < 64, "2nd argument of GETBIT should be less than 64");

	// eslint-disable-next-line no-bitwise
	return (value & (1n << index)) !== 0n ? 1 : 0;
}
