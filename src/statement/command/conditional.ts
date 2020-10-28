import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Conditional extends Statement {
	public expr: Array<[Expr, Statement[]]>;

	public constructor(expr: Conditional["expr"]) {
		super();
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
