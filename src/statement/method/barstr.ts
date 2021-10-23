import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function barStr(vm: VM, arg: Expr[]): string {
	const value = arg[0].reduce(vm);
	assert.number(value, "1st argument of BAR must be a number");
	const max = arg[1].reduce(vm);
	assert.number(max, "2nd argument of BAR must be a number");
	const length = arg[2].reduce(vm);
	assert.number(length, "3rd argument of BAR must be a number");

	const filled = Math.floor(length * (value / max));
	return "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]";
}