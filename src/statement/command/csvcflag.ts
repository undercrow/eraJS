import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class CsvCflag extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [numExpr, indexExpr] = this.arg.get();
		const num = numExpr.reduce(vm);
		assert.number(num, "1st Argument of CSVCFLAG should be an integer");
		const index = indexExpr.reduce(vm);
		assert.number(index, "2nd Argument of CSVCFLAG should be an integer");

		const character = vm.code.data.character.get(num);
		assert.cond(character != null, `Character #${num} does not exist`);

		const result = character.flags.get(index) ?? 0;
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
