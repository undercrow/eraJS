import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function sqrt(vm: VM, arg: Expr[]): number {
	const value = arg[0].reduce(vm);
	assert.number(value, "1st argument of sqrt must be a number");

	return Math.floor(Math.sqrt(value));
}
