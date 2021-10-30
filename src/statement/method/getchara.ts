import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function getChara(vm: VM, arg: Expr[]): Promise<number> {
	const id = await arg[0].reduce(vm);
	assert.bigint(id, "1st argument of GETCHARA should be an integer");

	for (let i = 0; i < vm.characterList.length; ++i) {
		if (vm.getValue("NO").get(vm, [i]) === id) {
			return i;
		}
	}
	return -1;
}
