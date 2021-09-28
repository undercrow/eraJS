import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvJuel(vm: VM, arg: Array<string | number>): number {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVJUEL must be an integer");
	const index = arg[1];
	assertNumber(index, "2nd argument of CSVJUEL must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);
	assert(character.juel.has(index), `Character JUEL #${index} does not exist`);

	return character.juel.get(index)!;
}
