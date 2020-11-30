import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class ExistCSV extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R1(E.expr));
	}

	public *run(vm: VM) {
		const id = this.arg.get().reduce(vm);
		assertNumber(id, "Argument of EXISTCSV must be an integer!");

		const result = vm.characterMap.has(id) ? 1 : 0;
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
