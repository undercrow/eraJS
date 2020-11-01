import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Case extends Statement {
	public expr: Expr;
	public branch: Array<[(Expr | [Expr, Expr]), Thunk]>;
	public def: Thunk;

	public constructor(expr: Case["expr"], branch: Case["branch"], def: Thunk) {
		super();
		this.expr = expr;
		this.branch = branch;
		this.def = def;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);

		for (const [cond, expr] of this.branch) {
			if (Array.isArray(cond)) {
				const start = cond[0].reduce(vm);
				const end = cond[1].reduce(vm);
				if (start <= value && value <= end) {
					return yield* expr.run(vm);
				}
			} else {
				if (cond.reduce(vm) === value) {
					return yield* expr.run(vm);
				}
			}
		}

		return null;
	}

	public getThunk(): Thunk[] {
		return [...this.branch.map((b) => b[1]), this.def];
	}
}
