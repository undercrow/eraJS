import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function csvTalent(vm: VM, arg: Expr[]): number {
	const num = arg[0].reduce(vm);
	assert.number(num, "1st argument of CSVTALENT must be an integer");
	const index = arg[1].reduce(vm);
	assert.number(index, "2nd argument of CSVTALENT must be an integer");

	const character = vm.code.data.character.get(num);
	assert.cond(character != null, `Character #${num} does not exist`);

	return character.talent.get(index) ?? 0;
}