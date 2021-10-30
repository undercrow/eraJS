import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function unicode(vm: VM, arg: Expr[]): Promise<string> {
	const value = await arg[0].reduce(vm);
	assert.bigint(value, "1st Argument of UNICODE should be a number");

	return String.fromCharCode(Number(value));
}
