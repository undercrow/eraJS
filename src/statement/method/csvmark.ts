import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvMark(vm: VM, arg: Array<string | number>): number {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVMARK must be an integer");
	const index = arg[1];
	assertNumber(index, "2nd argument of CSVMARK must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);
	assert(character.mark.length > index, `Character MARK #${index} does not exist`);

	return character.mark[index];
}
