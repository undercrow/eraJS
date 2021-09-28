import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvCstr(vm: VM, arg: Array<string | number>): string {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVCSTR must be an integer");
	const index = arg[1];
	assertNumber(index, "2nd argument of CSVCSTR must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);

	return character.cstr.get(index) ?? "";
}
