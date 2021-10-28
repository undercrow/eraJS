import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function rand(vm: VM, arg: Expr[]): Promise<number> {
	if (arg.length === 0) {
		assert.cond(false, "RAND should have at least 1 argument");
	} else if (arg.length === 1) {
		const max = await arg[0].reduce(vm);
		assert.number(max, "1st argument of RAND should be an integer");
		return vm.random.next() % max;
	} else {
		const min = await arg[0].reduce(vm);
		assert.number(min, "1st argument of RAND should be an integer");
		const max = await arg[1].reduce(vm);
		assert.number(max, "2nd argument of RAND should be an integer");

		return (vm.random.next() % (max - min)) + min;
	}
}
