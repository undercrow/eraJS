import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";

export default function csvNickname(vm: VM, arg: Array<string | number>): string {
	const num = arg[0];
	assertNumber(num, "1st argument of CSVNICKNAME must be an integer");

	const character = vm.code.data.character.get(num);
	assert(character != null, `Character #${num} does not exist`);

	return character.nickname;
}
