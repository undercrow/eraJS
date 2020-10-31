import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Conditional extends Statement {
	public expr: Array<[Expr, Thunk]>;

	public constructor(expr: Conditional["expr"]) {
		super();
		this.expr = expr;
	}

	public *run(vm: VM) {
		for (const expr of this.expr) {
			const cond = expr[0].reduce(vm);
			assertNumber(cond, "Condition should be an integer");
			if (cond !== 0) {
				return yield* expr[1].run(vm);
			}
		}

		return null;
	}

	public getThunk(): Thunk[] {
		return this.expr.map((expr) => expr[1]);
	}
}
