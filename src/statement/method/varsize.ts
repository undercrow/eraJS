import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function varSize(vm: VM, arg: Expr[]): number {
	const name = arg[0].reduce(vm);
	assert.string(name, "1st Argument of VARSIZE should be a string");

	const depth = arg.length >= 2 ? arg[1].reduce(vm) : 0;
	assert.number(depth, "2nd argument of VARSIZE must be a number");
	return vm.getValue(name).length(depth);
}
