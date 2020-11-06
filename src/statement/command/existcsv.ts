import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class ExistCSV extends Statement {
	public id: Expr;

	public constructor(id: Expr) {
		super();
		this.id = id;
	}

	public *run(vm: VM) {
		const id = this.id.reduce(vm);
		assertNumber(id, "Argument of EXISTCSV must be an integer!");

		vm.setValue(vm.characterMap.has(id) ? 1 : 0, "RESULT", 0);

		return null;
	}
}
