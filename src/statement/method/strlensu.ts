import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function strLenSU(vm: VM, arg: Expr[]): Promise<number> {
	const value = await arg[0].reduce(vm);
	assert.string(value, "1st Argument of STRLENS should be a string");

	return value.length;
}
