import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default async function csvCflag(vm: VM, arg: Expr[]): Promise<number> {
	const num = await arg[0].reduce(vm);
	assert.bigint(num, "1st argument of CSVCFLAG must be an integer");
	const index = await arg[1].reduce(vm);
	assert.bigint(index, "2nd argument of CSVCFLAG must be an integer");

	const character = vm.code.csv.character.get(Number(num));
	assert.cond(character != null, `Character #${num} does not exist`);

	return character.cflag.get(Number(index)) ?? 0;
}
