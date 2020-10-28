import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Statement from "../index";

export default class Conditional implements Statement {
	public expr: Array<[Expr, Statement[]]>;

	public constructor(expr: Conditional["expr"]) {
		this.expr = expr;
	}

	public *run(vm: VM) {
		for (const expr of this.expr) {
			const cond = expr[0].reduce(vm);
			assertNumber(cond, "Condition should be an integer");
			if (cond !== 0) {
				return yield* vm.eval(expr[1]);
			}
		}

		return null;
	}
}
