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
		idList.sort();
		idList.reverse();

		const charaNum = vm.getValue("CHARANUM") as number;
		for (const id of idList as number[]) {
			vm.removeAt("NO", id);
			vm.removeAt("NAME", id);
			vm.removeAt("CALLNAME", id);
			vm.removeAt("CFLAG", id);
			vm.removeAt("TALENT", id);
			vm.removeAt("MAXBASE", id);
			vm.removeAt("BASE", id);
			vm.removeAt("ABL", id);
			vm.removeAt("EXP", id);
			vm.removeAt("CSTR", id);
			vm.removeAt("MARK", id);
			vm.removeAt("PALAM", id);
			vm.removeAt("JUEL", id);
		}

		vm.setValue(charaNum - idList.length, "CHARANUM");

		return null;
	}
}
