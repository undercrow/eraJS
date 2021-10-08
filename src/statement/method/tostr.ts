import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function toStr(vm: VM, arg: Expr[]): string {
	const value = arg[0].reduce(vm);
	assert.number(value, "1st Argument of TOSTR should be a number");

	return value.toString();
}
