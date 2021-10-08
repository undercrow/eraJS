import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function toInt(vm: VM, arg: Expr[]): number {
	const value = arg[0].reduce(vm);
	assert.string(value, "1st Argument of TOINT should be a string");

	const result = Number(value);
	return isNaN(result) ? 0 : result;
}
