import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function power(vm: VM, arg: Expr[]): number {
	const base = arg[0].reduce(vm);
	assert.number(base, "1st argument of POWER must be a number");
	const exponent = arg[1].reduce(vm);
	assert.number(exponent, "2nd argument of POWER must be a number");

	return base ** exponent;
}
