import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvName(vm: VM, arg: Array<string | number>): string {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVNAME must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);

	return character.name;
}
