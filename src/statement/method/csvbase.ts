import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvBase(vm: VM, arg: Array<string | number>): number {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVBASE must be an integer");
	const index = arg[1];
	assertNumber(index, "2nd argument of CSVBASE must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);
	assert(character.base.length > index, `Character BASE #${index} does not exist`);

	return character.base[index];
}
