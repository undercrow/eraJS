import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function strLenS(vm: VM, arg: Expr[]): number {
	const value = arg[0].reduce(vm);
	assert.string(value, "1st Argument of STRLENS should be a string");

	return value.length;
}
