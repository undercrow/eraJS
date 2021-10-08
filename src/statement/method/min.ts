import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function min(vm: VM, arg: Expr[]): number {
	assert.cond(arg.length > 0, "MIN must have at least 1 argument");
	arg.forEach((a, i) => {
		assert.number(a.reduce(vm), `${i + 1}th argument of MIN must be a number`);
	});

	return Math.min(...arg.map((a) => a.reduce(vm) as number));
}
