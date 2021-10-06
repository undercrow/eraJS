import {assert, assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class CsvCstr extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [numExpr, indexExpr] = this.arg.get();
		const num = numExpr.reduce(vm);
		assertNumber(num, "1st Argument of CSVCSTR should be an integer");
		const index = indexExpr.reduce(vm);
		assertNumber(index, "2nd Argument of CSVCSTR should be an integer");

		const character = vm.code.data.character.get(num);
		assert(character != null, `Character #${num} does not exist`);

		const result = character.cstr.get(index) ?? 0;
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
