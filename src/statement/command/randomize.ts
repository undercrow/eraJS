import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class AddChara extends Statement {
	public expr: Lazy<Expr>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, U.arg1R1(E.expr));
	}

	public *run(vm: VM) {
		const expr = this.expr.get();
		const seed = expr.reduce(vm);
		assertNumber(seed, "1st argument of RANDOMIZE must be a number");

		vm.random.state = seed;

		return null;
	}
}
