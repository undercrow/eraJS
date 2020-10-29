import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class DelChara extends Statement {
	public charaters: Expr[];

	public constructor(characters: Expr[]) {
		super();
		this.charaters = characters;
	}

	public *run(vm: VM) {
		const idList = this.charaters.map((c) => c.reduce(vm));
		idList.forEach((id) => assertNumber(id, "Character id should be an integer"));

		const newCharacters = [];
		for (let i = 0; i < vm.characters.length; ++i) {
			if (!idList.includes(i)) {
				newCharacters.push(vm.characters[i]);
			}
		}

		return null;
	}
}
