import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class StrLen extends Statement {
	public charaters: Expr[];

	public constructor(characters: Expr[]) {
		super();
		this.charaters = characters;
	}

	public *run(vm: VM) {
		for (const expr of this.charaters) {
			const id = expr.reduce(vm);
			assertNumber(id, "Character id should be an integer");

			const character = vm.characterMap.get(id);
			assert(character != null, `Character with id ${id} does not exist`);

			vm.characters.push({
				...character,
				flags: new Map(character.flags),
			});
		}
		vm.setValue(vm.characters.length, "CHARANUM");

		return null;
	}
}
