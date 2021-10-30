import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function existCsv(vm: VM, arg: Expr[]): Promise<number> {
	const num = await arg[0].reduce(vm);
	assert.bigint(num, "1st argument of EXISTCSV should be a number");

	return vm.templateMap.has(Number(num)) ? 1 : 0;
}
