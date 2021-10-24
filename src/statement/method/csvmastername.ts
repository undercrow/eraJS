import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function csvMastername(vm: VM, arg: Expr[]): string {
	const num = arg[0].reduce(vm);
	assert.number(num, "1st argument of CSVMASTERNAME must be an integer");

	const character = vm.code.csv.character.get(num);
	assert.cond(character != null, `Character #${num} does not exist`);

	return character.mastername;
}
