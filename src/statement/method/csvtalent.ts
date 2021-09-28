import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvTalent(vm: VM, arg: Array<string | number>): number {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVTALENT must be an integer");
	const index = arg[1];
	assertNumber(index, "2nd argument of CSVTALENT must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);
	assert(character.talent.has(index), `Character TALENT #${index} does not exist`);

	return character.talent.get(index)!;
}
