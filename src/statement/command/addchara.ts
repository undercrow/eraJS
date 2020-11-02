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
				id: character.id,
				name: character.name,
				nickname: character.nickname,
				talent: character.talent.slice(),
				maxBase: character.maxBase.slice(),
				base: character.base.slice(),
				abilities: character.abilities.slice(),
				exp: character.exp.slice(),
				flags: character.flags.slice(),
				cstr: character.cstr.slice(),
				mark: character.mark.slice(),
			});
		}
		vm.setValue(vm.characters.length, "CHARANUM");

		return null;
	}
}
