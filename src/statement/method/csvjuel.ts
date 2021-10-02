import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";

export default function csvJuel(vm: VM, arg: Expr[]): number {
	const num = arg[0].reduce(vm);
	assertNumber(num, "1st argument of CSVJUEL must be an integer");
	const index = arg[1].reduce(vm);
	assertNumber(index, "2nd argument of CSVJUEL must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);

	return character.juel.get(index) ?? 0;
}
