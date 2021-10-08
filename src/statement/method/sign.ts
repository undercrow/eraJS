import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function sign(vm: VM, arg: Expr[]): number {
	const value = arg[0].reduce(vm);
	assert.number(value, "1st argument of SIGN must a be number");

	return Math.sign(value);
}
