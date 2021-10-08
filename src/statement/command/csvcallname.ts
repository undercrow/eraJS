import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class CsvCallname extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const numExpr = this.arg.get();
		const num = numExpr.reduce(vm);
		assert.number(num, "1st Argument of CSVCALLNAME should be an integer");

		const character = vm.code.data.character.get(num);
		assert.cond(character != null, `Character #${num} does not exist`);

		const result = character.callname;
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
