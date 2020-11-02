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

			const charaNum = vm.getValue("CHARANUM") as number;
			vm.setValue(character.id, "NO", charaNum);
			vm.setValue(character.name, "NAME", charaNum);
			vm.setValue(character.nickname, "CALLNAME", charaNum);
			character.flags.forEach((v, i) => vm.setValue(v, "CFLAG", charaNum, i));
			character.talent.forEach((v, i) => vm.setValue(v, "TALENT", charaNum, i));
			character.maxBase.forEach((v, i) => vm.setValue(v, "MAXBASE", charaNum, i));
			character.base.forEach((v, i) => vm.setValue(v, "BASE", charaNum, i));
			character.abilities.forEach((v, i) => vm.setValue(v, "ABL", charaNum, i));
			character.exp.forEach((v, i) => vm.setValue(v, "EXP", charaNum, i));
			character.cstr.forEach((v, i) => vm.setValue(v, "CSTR", charaNum, i));
			character.mark.forEach((v, i) => vm.setValue(v, "MARK", charaNum, i));
			character.palam.forEach((v, i) => vm.setValue(v, "PALAM", charaNum, i));
			character.juel.forEach((v, i) => vm.setValue(v, "JUEL", charaNum, i));

			vm.setValue(charaNum + 1, "CHARANUM");
		}

		return null;
	}
}
